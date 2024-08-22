using Domain;

namespace Application.DTOs.Friendship;

public class FriendshipDto
{
    
    public string Username { get; set; }
    public string UserPhoto { get; set; }
    public FriendshipStatusDto Status { get; set; }
    public DateTime ModifiedAt { get; set; }
}
