namespace Domain.Entities;

public class AttractionType
{
    public Guid Id { get; set; }
    public string Name { get; set; }

    public List<Attraction> Attractions { get; set; } = [];
}
