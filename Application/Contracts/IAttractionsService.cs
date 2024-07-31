using Application.DTOs;
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

    public Task<AttractionDto> CreateAttraction(AttractionAddOrEditDto attractionDto);

    public Task<AttractionDto> UpdateAttraction(AttractionAddOrEditDto attractionDto);

    public Task<Attraction> DeleteAttraction(Guid id);

    public Task React(Guid id, ReactionType reactionType);

    public Task<CommentDto> AddComment(Guid attractionId, string body);

    public Task<List<CommentDto>> GetComments(Guid attractionId);
}
