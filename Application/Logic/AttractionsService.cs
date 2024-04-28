using Application.Contracts;
using AutoMapper;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Logic;

public class AttractionsService(DataContext context, IMapper mapper) : IAttractionsService
{
    public async Task<List<Attraction>> GetAttractions()
    {
        return await context.Attractions.ToListAsync();
    }

    public async Task<Attraction> GetAttraction(Guid id)
    {
        return await context.Attractions.FindAsync(id);
    }

    public async Task<Attraction> CreateAttraction(Attraction attraction)
    {
        attraction.Id = Guid.NewGuid();
        context.Attractions.Add(attraction);
        await context.SaveChangesAsync();
        return attraction;
    }

    public async Task<Attraction> UpdateAttraction(Attraction attraction)
    {
        var attractionToEdit = await context.Attractions.FindAsync(attraction.Id);
        mapper.Map(attraction, attractionToEdit);
        await context.SaveChangesAsync();
        return attractionToEdit;
    }

    public async Task<Attraction> DeleteAttraction(Guid id)
    {
        var attraction = await context.Attractions.FindAsync(id);
        if (attraction == null)
        {
            throw new Exception("Attraction not found");
        }

        context.Remove(attraction);
        await context.SaveChangesAsync();
        return attraction;
    }
}