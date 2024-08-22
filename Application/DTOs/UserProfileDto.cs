using Application.DTOs.Friendship;

namespace Application.DTOs;

public class UserProfileDto
{
    public string Username { get; set; }
    public string Photo { get; set; }
    public int CreatedAttractions { get; set; }
    public int WrittenComments { get; set; }
    public string Bio { get; set; }
    public FriendshipStatusDto FriendshipStatus { get; set; }
}
