using Application.Contracts;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Logic;

public class AttractionsService(DataContext context) : IAttractionsService
{
    public async Task<List<Attraction>> GetAttractions()
    {
        return await context.Attractions.ToListAsync();
    }

    public async Task<Attraction> GetAttraction(Guid id)
    {
        return await context.Attractions.FindAsync(id);
    }
}