using System.Collections.Immutable;
using Application.Contracts;
using Application.Contracts.Infrastructure;
using Application.DTOs.Attraction;
using Application.DTOs.Attraction.Query;
using Application.DTOs.Pagination;
using Application.Logic.Extensions;
using Application.Utils;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Logic;

public class AttractionsService(DataContext context, IMapper mapper, AuthUtils authUtils, IPhotoAccessor photoAccessor)
    : IAttractionsService
{
    public async Task<PagedList<AttractionDto>> GetAttractions(AttractionsQuery query)
    {
        var queryable = context.Attractions
            .Sort(query.SortField, query.SortOrder)
            .Search(query.SearchField, query.SearchValue)
            .Filter(query.Types)
            .ProjectTo<AttractionDto>(mapper.ConfigurationProvider)
            .AsQueryable();
        return await PagedList<AttractionDto>.ToPagedList(queryable, query.PageNumber, query.PageSize);
    }

    public async Task<AttractionDto> GetAttraction(Guid id)
    {
        var attraction = await GetOrThrow(id);
        return mapper.Map<AttractionDto>(attraction);
    }

    public async Task<AttractionDto> CreateAttraction(AttractionAddOrEditDto attractionDto)
    {
        var attraction = mapper.Map<Attraction>(attractionDto);
        await ValidateAttraction(attraction);
        Validator.Run(attractionDto.Photos == null || attractionDto.Photos.Length < 1, "PhotoList",
            ["At least one photo is required"]);

        attraction.Id = Guid.NewGuid();
        attraction.CreatorId = authUtils.GetCurrentUser().Id;
        await context.Attractions.AddAsync(attraction);

        var photos = await photoAccessor.UploadPhotos(attractionDto.Photos!.Select(ap => ap.NewPhoto).ToArray());
        attraction.Photos = photos;

        await context.SaveChangesAsync();
        return mapper.Map<AttractionDto>(attraction);
    }

    public async Task<AttractionDto> UpdateAttraction(AttractionAddOrEditDto attractionDto)
    {
        var attraction = await GetOrThrow(attractionDto.Id, true);
        EnsureWriteAccess(attraction);

        mapper.Map(attractionDto, attraction);
        await ValidateAttraction(attraction);
        await UpdatePhotos(attraction, attractionDto.Photos);

        await context.SaveChangesAsync();
        return mapper.Map<AttractionDto>(attraction);
    }

    public async Task<Attraction> DeleteAttraction(Guid id)
    {
        var attraction = await context.Attractions.FindAsyncOrThrow(id);
        EnsureWriteAccess(attraction);
        context.Remove(attraction);
        await context.SaveChangesAsync();
        return attraction;
    }

    public async Task React(Guid id, ReactionTypes reactionType)
    {
        await context.Attractions.FindAsyncOrThrow(id);
        var userId = authUtils.GetCurrentUser().Id;
        var reaction = await context.Reactions.FindAsync(userId, id);

        if (reaction == null)
        {
            await context.Reactions.AddAsync(new Reaction { AttractionId = id, UserId = userId, Type = reactionType });
        }
        else
        {
            reaction.Type = reactionType;
        }

        await context.SaveChangesAsync();
    }

    private async Task UpdatePhotos(Attraction attraction, AttractionPhotosDto[] newPhotoDtoList)
    {
        var oldPhotos = attraction.Photos;
        var oldPhotosSet = new HashSet<string>(oldPhotos);

        Dictionary<int, IFormFile> photosToAdd = new();
        var photosToDelete = oldPhotos.Skip(newPhotoDtoList.Length).ToHashSet();
        List<string> newPhotos = [..new string[Math.Max(oldPhotos.Count, newPhotoDtoList.Length)]];
        Dictionary<int, string> errors = new();

        for (var i = 0; i < newPhotoDtoList.Length; i++)
        {
            var newPhoto = newPhotoDtoList[i].NewPhoto;
            var currentPhotoUrl = newPhotoDtoList[i].CurrentUrl;

            if (currentPhotoUrl == null)
            {
                if (newPhoto == null) // keep
                {
                    if (i >= oldPhotos.Count)
                    {
                        errors.Add(i, "Cannot keep more photos than the original");
                    }
                    else
                    {
                        newPhotos[i] = oldPhotos[i];
                    }
                }
                else // add
                {
                    if (i < oldPhotos.Count)
                    {
                        errors.Add(i, "Cannot add if photo exists, use replace");
                    }
                    else
                    {
                        newPhotos[i] = null;
                        photosToAdd.Add(i, newPhoto);
                    }
                }
            }
            else
            {
                if (newPhoto == null) // move
                {
                    if (!oldPhotosSet.Contains(currentPhotoUrl))
                    {
                        errors.Add(i, $"Existing photo not found for url {currentPhotoUrl}");
                    }
                    else
                    {
                        newPhotos[i] = currentPhotoUrl;
                    }
                }
                else // replace = delete + add
                {
                    if (i >= oldPhotos.Count)
                    {
                        errors.Add(i, "Cannot replace more photos than the original");
                    }
                    else
                    {
                        photosToDelete.Add(oldPhotos[i]);
                        newPhotos[i] = null;
                        photosToAdd.Add(i, newPhoto);
                    }
                }
            }
        }

        if (errors.Count > 0)
        {
            var message = errors.OrderBy(pair => pair.Key)
                .Select(pair => $"Error for photo {pair.Key + 1}: {pair.Value}").Aggregate("",
                    (acc, val) => acc + val + "\n");
            Console.WriteLine("Failed to update photos");
            Console.WriteLine(message);
            throw new Exception("Failed to update photos");
        }

        // upload new photos + update the new photos list + update the attraction's photos
        var photosToAddList = photosToAdd.OrderBy(pair => pair.Key).ToImmutableList();
        var urls = await photoAccessor.UploadPhotos(photosToAddList.Select(pair => pair.Value).ToArray());
        for (var i = 0; i < urls.Count; i++)
        {
            newPhotos[photosToAddList[i].Key] = urls[i];
        }

        attraction.Photos = newPhotos;

        // try to delete old uploaded photos
        await photoAccessor.DeletePhotos(photosToDelete.ToList());
    }

    private async Task<Attraction> GetOrThrow(Guid id, bool tracking = false)
    {
        var queryable = context.Attractions
            .Include(a => a.Country)
            .Include(a => a.AttractionType)
            .Where(a => a.Id == id);
        queryable = tracking ? queryable.AsTracking() : queryable.AsNoTracking();
        var attraction = await queryable.FirstOrDefaultAsync();
        if (attraction == null) throw new NotFoundException();
        return attraction;
    }

    private void EnsureWriteAccess(Attraction attraction)
    {
        if (attraction.CreatorId != authUtils.GetCurrentUser().Id)
            throw new ForbiddenException();
    }

    private async Task ValidateAttraction(Attraction attraction)
    {
        var taskAttractionType = context.AttractionTypes.FindAsync(attraction.AttractionTypeId).AsTask();
        var taskCountry = context.Countries.FindAsync(attraction.CountryId).AsTask();
        await Task.WhenAll(taskAttractionType, taskCountry);
        new Validator()
            .Add(taskAttractionType.Result == null, "AttractionTypeId", ["Attraction type not found"])
            .Add(taskCountry.Result == null, "CountryId", ["Country not found"])
            .Run();
    }
}
