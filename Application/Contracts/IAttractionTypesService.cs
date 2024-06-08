using Domain.Entities;

namespace Application.Contracts;

public interface IAttractionTypesService
{
    public Task<List<AttractionType>> GetAttractionTypes();

    public Task<AttractionType> GetAttractionType(Guid id);

    public Task<AttractionType> CreateAttractionType(AttractionType attractionType);

    public Task<AttractionType> UpdateAttractionType(AttractionType attractionType);

    public Task<AttractionType> DeleteAttractionType(Guid id);
}