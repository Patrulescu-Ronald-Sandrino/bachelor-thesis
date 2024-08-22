using Application.Contracts;
using Application.DTOs.Friendship;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route(Route + "/{username}")]
public class FriendshipsController(IFriendshipService friendshipService) : BaseApiController
{
    [HttpGet]
    public async Task<Dictionary<FriendshipStatusDto, List<FriendshipDto>>> Get(string username)
    {
        return await friendshipService.GetFriendships(username);
    }

    [HttpPost]
    public async Task<FriendshipStatusDto> Add(string username)
    {
        return await friendshipService.Add(username);
    }

    [HttpDelete]
    public async Task<FriendshipStatusDto> Delete(string username)
    {
        return await friendshipService.Delete(username);
    }
}
