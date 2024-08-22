using Application.Contracts;
using Application.DTOs;
using Application.Exceptions;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Logic;

public class AttractionTypesService(DataContext context, IMapper mapper) : IAttractionTypesService
{
    public async Task<List<AttractionTypeDto>> Get()
    {
        return await Get(null);
    }

    public async Task<AttractionTypeDto> Find(Guid id)
    {
        var attractionTypes = await Get(id);
        return attractionTypes.Count switch
        {
            > 1 => throw new Exception($"Multiple attraction types found with the same id - {id}"),
            _ => attractionTypes.FirstOrDefault() ?? throw new NotFoundException(),
        };
    }

    public async Task<AttractionTypeDto> Add(string name)
    {
        var attractionType = new AttractionType { Id = Guid.NewGuid(), Name = name };
        await context.AttractionTypes.AddAsync(attractionType);
        await context.SaveChangesAsync();
        return mapper.Map<AttractionTypeDto>(attractionType);
    }

    public async Task<AttractionTypeDto> Update(AttractionTypeDto attractionTypeDto)
    {
        var attractionType = await FindInner(attractionTypeDto.Id);
        attractionType.Name = attractionTypeDto.Name;
        await context.SaveChangesAsync();
        return mapper.Map<AttractionTypeDto>(attractionType);
    }

    public async Task<AttractionTypeDto> Delete(Guid id)
    {
        var attractionType = await FindInner(id);

        if (attractionType.Attractions.Count > 0) throw new ValidationException("Attraction type is in use");

        context.Remove(attractionType);
        await context.SaveChangesAsync();
        return mapper.Map<AttractionTypeDto>(attractionType);
    }

    private async Task<List<AttractionTypeDto>> Get(Guid? id)
    {
        var attractionTypes = await context.AttractionTypes.Where(at => !id.HasValue || at.Id == id)
            .Include(at => at.Attractions)
            .ProjectTo<AttractionTypeDto>(mapper.ConfigurationProvider).ToListAsync();
        return attractionTypes;
    }

    private async Task<AttractionType> FindInner(Guid id)
    {
        return await context.AttractionTypes
            .Where(at => at.Id == id)
            .Include(at => at.Attractions)
            .FirstOrDefaultAsync() ?? throw new NotFoundException();
    }
}
