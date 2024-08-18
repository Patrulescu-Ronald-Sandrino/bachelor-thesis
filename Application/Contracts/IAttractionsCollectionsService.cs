using Application.DTOs;

namespace Application.Contracts;

public interface IAttractionsCollectionsService
{
    Task<List<AttractionsCollectionDto>> GetCollections(string username);
    Task<AttractionsCollectionDto> GetCollection(string username, Guid id);
    Task<AttractionsCollectionDto> AddCollection(string username, AttractionsCollectionDto collectionDto);
    Task<AttractionsCollectionDto> UpdateCollection(string username, AttractionsCollectionDto collectionDto);
    Task<List<AttractionsCollectionDto>> UpdateOrder(string username, List<Guid> collectionIds);
    Task<AttractionsCollectionDto> UpdateCollectionThumbnail(string username, Guid id, string thumbnail);
    Task DeleteCollection(string username, Guid id);
    Task<AttractionsCollectionDto> AddItem(string username, Guid collectionId, AttractionsCollectionItemDto itemDto);
    Task<AttractionsCollectionDto> UpdateItemNote(string username, Guid collectionId, Guid attractionId, string note);
    Task<AttractionsCollectionDto> UpdateItemsOrder(string username, Guid collectionId, List<Guid> attractionIds);
    Task<AttractionsCollectionDto> DeleteItem(string username, Guid collectionId, Guid attractionId);
}
