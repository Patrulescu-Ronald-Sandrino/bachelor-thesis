using Application.Contracts;
using AutoMapper;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Logic;

public class AttractionTypesService(DataContext context, IMapper mapper) : IAttractionTypesService
{
    public async Task<List<AttractionType>> GetAttractionTypes()
    {
        return await context.AttractionTypes.ToListAsync();
    }

    public async Task<AttractionType> GetAttractionType(Guid id)
    {
        return await context.AttractionTypes.FindAsync(id);
    }

    public async Task<AttractionType> CreateAttractionType(AttractionType attractionType)
    {
        attractionType.Id = Guid.NewGuid();
        await context.AttractionTypes.AddAsync(attractionType);
        await context.SaveChangesAsync();
        return attractionType;
    }

    public async Task<AttractionType> UpdateAttractionType(AttractionType attractionType)
    {
        var attractionTypeToEdit = await context.AttractionTypes.FindAsync(attractionType.Id);
        mapper.Map(attractionType, attractionTypeToEdit);
        await context.SaveChangesAsync();
        return attractionTypeToEdit;
    }

    public async Task<AttractionType> DeleteAttractionType(Guid id)
    {
        var attractionType = await context.AttractionTypes.FindAsync(id);
        if (attractionType == null)
        {
            throw new Exception("Attraction type not found");
        }

        context.Remove(attractionType);
        await context.SaveChangesAsync();
        return attractionType;
    }
}