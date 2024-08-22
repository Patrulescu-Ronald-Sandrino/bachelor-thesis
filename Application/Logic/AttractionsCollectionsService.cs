using System.Collections.Frozen;
using Application.Contracts;
using Application.DTOs;
using Application.Exceptions;
using Application.Logic.Extensions;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using Domain.Entities;
using Domain.Types;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Logic;

public class AttractionsCollectionsService(DataContext context, IMapper mapper, AuthUtil authUtil)
    : IAttractionsCollectionsService
{
    public async Task<List<AttractionsCollectionDto>> GetCollections(string username)
    {
        return await GetCollections(username, null);
    }

    public async Task<AttractionsCollectionDto> GetCollection(string username, Guid id)
    {
        var collections = await GetCollections(username, id);
        return collections.Count switch
        {
            > 1 => throw new Exception($"Multiple collections of user {username} found with the same id - {id}"),
            0 => throw new NotFoundException(),
            _ => collections.FirstOrDefault(),
        };
    }

    public async Task<AttractionsCollectionDto> AddCollection(string username, AttractionsCollectionDto collectionDto)
    {
        var userId = await EnsureWriteAccessOfUser(username);
        var collection = mapper.Map<AttractionsCollection>(collectionDto);

        collection.Id = Guid.NewGuid();
        collection.OwnerId = userId;

        // index
        var index = (await context.AttractionsCollections.Where(c => c.OwnerId == userId)
            .MaxAsync(c => (uint?)(c.Index + 1))).GetValueOrDefault();
        collection.Index = index;

        // handle attraction ids
        var attractionIds = collection.CollectionItems.Select(ci => ci.AttractionId).ToFrozenSet();
        var containedAttractions = await context.Attractions.Where(a => attractionIds.Contains(a.Id))
            .ToFrozenDictionaryAsync(a => a.Id, a => a);
        var containedAttractionIds =
            containedAttractions.Keys.ToFrozenSet();
        if (attractionIds.Count != containedAttractionIds.Count)
        {
            var notContainedAttractionIds = attractionIds.Except(containedAttractionIds);
            throw new NotFoundException(
                $"Attractions with ids {string.Join(", ", notContainedAttractionIds)} not found");
        }

        // thumbnail
        if (collection.Thumbnail == null && collection.CollectionItems.Count > 0)
            collection.Thumbnail =
                containedAttractions[collection.CollectionItems[0].AttractionId].Photos.FirstOrDefault();

        await context.AttractionsCollections.AddAsync(collection);
        var result = await context.SaveChangesAsync() > 0;

        if (!result) throw new Exception("Failed to add collection");
        return await GetCollection(username, collection.Id);
    }

    public async Task<AttractionsCollectionDto> UpdateCollection(string username,
        AttractionsCollectionDto collectionDto)
    {
        var collection = await EnsureWriteAccessOfCollection(username, collectionDto.Id);

        collection.Name = collectionDto.Name;
        collection.Description = collectionDto.Description;
        collection.Visibility = collectionDto.Visibility;

        await context.SaveChangesAsync();

        return mapper.Map<AttractionsCollectionDto>(collection);
    }

    public async Task<List<AttractionsCollectionDto>> UpdateOrder(string username, List<Guid> collectionIds)
    {
        var userId = await EnsureWriteAccessOfUser(username);

        var collections = await context.AttractionsCollections.Where(c => c.OwnerId == userId)
            .ToFrozenDictionaryAsync(c => c.Id, c => c);
        var collectionIdsFromDb = collections.Keys.ToFrozenSet();
        if (!collectionIdsFromDb.SetEquals(collectionIds))
            throw new NotFoundException("List of collection ids doesn't correspond to the user's collections");

        foreach (var tuple in collectionIds.Select((guid, i) => new { i, id = guid }))
            collections[tuple.id].Index = Convert.ToUInt32(tuple.i);

        await context.SaveChangesAsync();

        return mapper.Map<List<AttractionsCollectionDto>>(collections.Values);
    }

    public async Task<AttractionsCollectionDto> UpdateCollectionThumbnail(string username, Guid id, string thumbnail)
    {
        var collection = await EnsureWriteAccessOfCollection(username, id);

        collection.Thumbnail = thumbnail;

        await context.SaveChangesAsync();

        return mapper.Map<AttractionsCollectionDto>(collection);
    }

    public async Task DeleteCollection(string username, Guid id)
    {
        var collection = await EnsureWriteAccessOfCollection(username, id);

        context.Remove(collection);

        var succeeded = await context.SaveChangesAsync() > 0;

        if (!succeeded) throw new Exception("Failed to delete collection");

        await context.AttractionsCollections.Where(c => c.OwnerId == collection.OwnerId && c.Index > collection.Index)
            .ForEachAsync(c => c.Index--);

        await context.SaveChangesAsync();
    }

    public async Task<AttractionsCollectionDto> AddItem(string username, Guid collectionId,
        AttractionsCollectionItemDto itemDto)
    {
        var collection = await EnsureWriteAccessOfCollection(username, collectionId);

        if (collection.CollectionItems.Any(ci => ci.AttractionId == itemDto.AttractionId))
            throw new ValidationException("Attraction already exists in the collection");

        var attraction = await context.Attractions.FindAsync(itemDto.AttractionId) ??
                         throw new NotFoundException("Attraction not found");

        var index = collection.CollectionItems.Max(ci => (uint?)(ci.Index + 1)).GetValueOrDefault();

        var item = new AttractionsCollectionItem
        {
            CollectionId = collectionId,
            AttractionId = itemDto.AttractionId,
            Note = itemDto.Note,
            Index = index,
            Attraction = attraction,
            Collection = collection,
        };

        collection.CollectionItems.Add(item);

        var succeeded = await context.SaveChangesAsync() > 0;
        if (!succeeded) throw new Exception("Failed to add item");

        return mapper.Map<AttractionsCollectionDto>(collection);
    }

    public async Task<AttractionsCollectionDto> UpdateItemNote(string username, Guid collectionId, Guid attractionId,
        string note)
    {
        var collection = await EnsureWriteAccessOfCollection(username, collectionId);

        var item = collection.CollectionItems.FirstOrDefault(ci => ci.AttractionId == attractionId) ??
                   throw new NotFoundException("Item not found");

        item.Note = note;

        await context.SaveChangesAsync();

        return mapper.Map<AttractionsCollectionDto>(collection);
    }

    public async Task<AttractionsCollectionDto> UpdateItemsOrder(string username, Guid collectionId,
        List<Guid> attractionIds)
    {
        var collection = await EnsureWriteAccessOfCollection(username, collectionId);

        var idToAttractionDictionary = collection.CollectionItems.ToFrozenDictionary(ci => ci.AttractionId, ci => ci);
        if (!idToAttractionDictionary.Keys.ToFrozenSet().SetEquals(attractionIds))
            throw new NotFoundException("List of attraction ids doesn't correspond to the collection's attractions");

        for (var i = 0; i < attractionIds.Count; i++)
            idToAttractionDictionary[attractionIds[i]].Index = Convert.ToUInt32(i);

        await context.SaveChangesAsync();

        return mapper.Map<AttractionsCollectionDto>(collection);
    }

    public async Task<AttractionsCollectionDto> DeleteItem(string username, Guid collectionId, Guid attractionId)
    {
        var collection = await EnsureWriteAccessOfCollection(username, collectionId);

        var item = collection.CollectionItems.FirstOrDefault(ci => ci.AttractionId == attractionId) ??
                   throw new NotFoundException("Item not found");

        collection.CollectionItems.Remove(item);

        var succeeded = await context.SaveChangesAsync() > 0;
        if (!succeeded) throw new Exception("Failed to delete item");

        foreach (var item1 in collection.CollectionItems.Where(ci => ci.Index > item.Index)) item1.Index--;

        await context.SaveChangesAsync();

        return mapper.Map<AttractionsCollectionDto>(collection);
    }

    private async Task<List<AttractionsCollectionDto>> GetCollections(string username, Guid? id)
    {
        var currentUserId = await authUtil.GetCurrentUserId();
        return await context.AttractionsCollections
            .Where(c => c.Owner.UserName == username)
            .Where(c => !id.HasValue || c.Id == id)
            .Where(c => c.OwnerId == currentUserId
                        || c.Visibility == Visibility.Public
                        || (c.Visibility == Visibility.Friends
                            //@formatter:off
                            && (c.Owner.FriendshipsSent.Any(f => f.Status == FriendshipStatus.Accepted && f.ReceiverId == currentUserId)
                                || c.Owner.FriendshipsReceived.Any(f => f.Status == FriendshipStatus.Accepted && f.SenderId == currentUserId))
                            //@formatter:on
                        ))
            .OrderBy(c => c.Index)
            .ProjectTo<AttractionsCollectionDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    private async Task<Guid> EnsureWriteAccessOfUser(string username)
    {
        var currentUser = await authUtil.GetCurrentUser();
        if (currentUser.UserName != username) throw new ForbiddenException();
        return currentUser.Id;
    }

    private async Task<AttractionsCollection> EnsureWriteAccessOfCollection(string username, Guid id)
    {
        var userId = await EnsureWriteAccessOfUser(username);
        var collection =
            await context.AttractionsCollections.Where(c => c.Id == id && c.OwnerId == userId)
                .Include(c => c.CollectionItems.OrderBy(ci => ci.Index))
                .ThenInclude(ci => ci.Attraction)
                .FirstOrDefaultAsync() ?? throw new NotFoundException();
        return collection;
    }
}
