using Application.DTOs.Attraction;
using Application.DTOs.Attraction.Query;
using Application.DTOs.Pagination;
using Domain.Entities;
using Domain.Types;

namespace Application.Contracts;

public interface IAttractionsService
{
    public Task<PagedList<AttractionDto>> GetAttractions(AttractionsQuery query);

    public Task<AttractionDto> GetAttraction(Guid id);

    public Task<Attraction> CreateAttraction(Attraction attraction);

    public Task<AttractionDto> UpdateAttraction(Attraction attraction);

    public Task<Attraction> DeleteAttraction(Guid id);

    public Task React(Guid id, ReactionTypes reactionType);
}
