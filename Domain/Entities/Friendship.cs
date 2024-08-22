namespace Domain.Entities;

public class Friendship
{
    public Guid SenderId { get; set; }
    public Guid ReceiverId { get; set; }
    public FriendshipStatus Status { get; set; }
    public DateTime ModifiedAt { get; set; } = DateTime.UtcNow;

    public User Sender { get; set; }
    public User Receiver { get; set; }
}
