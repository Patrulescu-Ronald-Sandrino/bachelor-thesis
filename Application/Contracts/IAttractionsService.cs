using Application.DTOs;
using Domain.Entities;
using Domain.Types;

namespace Application.Contracts;

public interface IAttractionsService
{
    public Task<List<AttractionDto>> GetAttractions();

    public Task<AttractionDto> GetAttraction(Guid id);

    public Task<Attraction> CreateAttraction(Attraction attraction);

    public Task<AttractionDto> UpdateAttraction(Attraction attraction);

    public Task<Attraction> DeleteAttraction(Guid id);

    public Task React(Guid id, ReactionTypes reactionType);
}