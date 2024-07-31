namespace Domain.Entities;

public class AttractionComment
{
    public Guid Id { get; set; }
    public string Body { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public User Author { get; set; }
    public Attraction Attraction { get; set; }
}
