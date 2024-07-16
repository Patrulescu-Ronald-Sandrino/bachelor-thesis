using Application.Contracts;
using Application.DTOs.Attraction;
using Application.DTOs.Attraction.Query;
using Application.DTOs.Pagination;
using Application.Logic.Extensions;
using Application.Utils;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities;
using Domain.Types;
using Persistence;

namespace Application.Logic;

public class AttractionsService(DataContext context, IMapper mapper, AuthUtils authUtils) : IAttractionsService
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
        return mapper.Map<AttractionDto>(await context.Attractions.FindAsyncOrThrow(id));
    }

    public async Task<AttractionDto> CreateAttraction(AttractionDto attractionDto)
    {
        var attraction = mapper.Map<Attraction>(attractionDto);
        attractionDto.Id = Guid.NewGuid();
        await ValidateAttraction(attraction);
        await context.Attractions.AddAsync(attraction);
        await context.SaveChangesAsync();
        return mapper.Map<AttractionDto>(attraction);
    }

    public async Task<AttractionDto> UpdateAttraction(AttractionDto attractionDto)
    {
        var attractionToEdit = await context.Attractions.FindAsync(attractionDto.Id);
        mapper.Map(attractionDto, attractionToEdit);
        await ValidateAttraction(attractionToEdit);
        await context.SaveChangesAsync();
        return mapper.Map<AttractionDto>(attractionToEdit);
    }

    public async Task<Attraction> DeleteAttraction(Guid id)
    {
        var attraction = await context.Attractions.FindAsyncOrThrow(id);
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

    private async Task ValidateAttraction(Attraction attraction)
    {
        var taskAttractionType = context.AttractionTypes.FindAsync(attraction.AttractionTypeId).AsTask();
        var taskCountry = context.Countries.FindAsync(attraction.CountryId).AsTask();
        await Task.WhenAll(taskAttractionType, taskCountry);
        await context.Countries.FindAsync(attraction.CountryId);
        new Validator()
            .Add(taskAttractionType.Result == null, "AttractionTypeId", ["Attraction type not found"])
            .Add(taskCountry.Result == null, "CountryId", ["Country not found"])
            .Run();
    }
}
