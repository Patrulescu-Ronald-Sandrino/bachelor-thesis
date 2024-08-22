using Application.DTOs.Friendship;

namespace Application.Contracts;

public interface IFriendshipService
{
    Task<Dictionary<FriendshipStatusDto, List<FriendshipDto>>> GetFriendships(string username);
    Task<FriendshipStatusDto> Add(string username);
    Task<FriendshipStatusDto> Delete(string username);
}
