using Application.Contracts;
using Application.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities;
using Domain.Types;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Logic;

public class AttractionsService(DataContext context, IMapper mapper) : IAttractionsService
{
    public async Task<List<AttractionDto>> GetAttractions()
    {
        return await context.Attractions.ProjectTo<AttractionDto>(mapper.ConfigurationProvider).ToListAsync();
    }

    public async Task<AttractionDto> GetAttraction(Guid id)
    {
        return mapper.Map<AttractionDto>(await context.Attractions.FindAsyncOrThrow(id));
    }

    public async Task<Attraction> CreateAttraction(Attraction attraction)
    {
        attraction.Id = Guid.NewGuid();
        await context.Attractions.AddAsync(attraction);
        await context.SaveChangesAsync();
        return attraction;
    }

    public async Task<AttractionDto> UpdateAttraction(Attraction attraction)
    {
        var attractionToEdit = await context.Attractions.FindAsync(attraction.Id);
        mapper.Map(attraction, attractionToEdit);
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
        // TODO: get user id + uncomment save changes async
        var userId = Guid.NewGuid();
        var reaction = await context.Reactions.FindAsync(id, userId);

        if (reaction == null)
        {
            reaction = new Reaction { AttractionId = id, UserId = userId, Type = reactionType };
            await context.Reactions.AddAsync(reaction);
        }
        else
        {
            reaction.Type = reactionType;
        }

        throw new NotImplementedException();
        // await context.SaveChangesAsync();
    }
}