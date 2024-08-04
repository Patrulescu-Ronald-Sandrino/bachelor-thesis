using Application.Contracts;
using Application.Logic.Extensions;
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
        return await context.AttractionTypes.FindAsyncOrThrow(id);
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
        var attractionTypeToEdit = await context.AttractionTypes.FindAsyncOrThrow(attractionType.Id);
        mapper.Map(attractionType, attractionTypeToEdit);
        await context.SaveChangesAsync();
        return attractionTypeToEdit;
    }

    public async Task<AttractionType> DeleteAttractionType(Guid id)
    {
        var attractionType = await context.AttractionTypes.FindAsyncOrThrow(id);
        context.Remove(attractionType);
        await context.SaveChangesAsync();
        return attractionType;
    }
}
