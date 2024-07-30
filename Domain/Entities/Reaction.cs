using Domain.Types;

namespace Domain.Entities;

public class Reaction
{
    public Guid UserId { get; set; }
    public User User { get; set; }
    public Guid AttractionId { get; set; }
    public Attraction Attraction { get; set; }
    public ReactionType? Type { get; set; }
}
