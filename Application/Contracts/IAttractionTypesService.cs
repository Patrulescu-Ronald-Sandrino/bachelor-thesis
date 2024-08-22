using Application.DTOs;

namespace Application.Contracts;

public interface IAttractionTypesService
{
    public Task<List<AttractionTypeDto>> Get();

    public Task<AttractionTypeDto> Find(Guid id);

    public Task<AttractionTypeDto> Add(string name);

    public Task<AttractionTypeDto> Update(AttractionTypeDto attractionTypeDto);

    public Task<AttractionTypeDto> Delete(Guid id);
}
