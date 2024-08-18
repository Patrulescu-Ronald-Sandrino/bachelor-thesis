using System.Net.Mime;
using Application.Contracts;
using Application.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route(RoutePrefix + "/Attractions/{username}/collections")]
public class AttractionsCollectionsController(IAttractionsCollectionsService collectionsService) : BaseApiController
{
    [HttpGet]
    public async Task<List<AttractionsCollectionDto>> GetCollections(string username)
    {
        return await collectionsService.GetCollections(username);
    }

    [HttpGet("{id:guid}")]
    public async Task<AttractionsCollectionDto> GetCollection(string username, Guid id)
    {
        return await collectionsService.GetCollection(username, id);
    }

    [HttpPost]
    public async Task<AttractionsCollectionDto> AddCollection(string username, AttractionsCollectionDto collectionDto)
    {
        return await collectionsService.AddCollection(username, collectionDto);
    }

    [HttpPut]
    public async Task<AttractionsCollectionDto> UpdateCollection(string username,
        AttractionsCollectionDto collectionDto)
    {
        return await collectionsService.UpdateCollection(username, collectionDto);
    }

    [HttpPut("order")]
    public async Task<List<AttractionsCollectionDto>> UpdateOrder(string username, List<Guid> collectionIds)
    {
        return await collectionsService.UpdateOrder(username, collectionIds);
    }

    [HttpPut("{id:guid}/thumbnail")]
    public async Task<AttractionsCollectionDto> UpdateCollectionThumbnail(string username, Guid id, string thumbnail)
    {
        return await collectionsService.UpdateCollectionThumbnail(username, id, thumbnail);
    }

    [HttpDelete("{id:guid}")]
    public async Task DeleteCollection(string username, Guid id)
    {
        await collectionsService.DeleteCollection(username, id);
    }

    [HttpPost("{id:guid}/items")]
    public async Task<AttractionsCollectionDto> AddItem(string username, Guid id, AttractionsCollectionItemDto itemDto)
    {
        return await collectionsService.AddItem(username, id, itemDto);
    }

    [HttpPut("{id:guid}/items/{attractionId:guid}/note")]
    [Consumes(MediaTypeNames.Text.Plain)]
    public async Task<AttractionsCollectionDto> UpdateItemNote(string username, Guid id, Guid attractionId,
        [FromBody] string note)
    {
        return await collectionsService.UpdateItemNote(username, id, attractionId, note);
    }

    [HttpPut("{id:guid}/items/order")]
    public async Task<AttractionsCollectionDto> UpdateItemsOrder(string username, Guid id, List<Guid> attractionIds)
    {
        return await collectionsService.UpdateItemsOrder(username, id, attractionIds);
    }

    [HttpDelete("{id:guid}/items/{attractionId:guid}")]
    public async Task<AttractionsCollectionDto> DeleteItem(string username, Guid id, Guid attractionId)
    {
        return await collectionsService.DeleteItem(username, id, attractionId);
    }
}
