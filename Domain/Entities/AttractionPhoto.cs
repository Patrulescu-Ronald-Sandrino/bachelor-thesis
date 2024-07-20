namespace Domain.Entities;

public class AttractionPhoto
{
    public string Url { get; set; }
    public uint Position { get; set; }

    public Guid AttractionId { get; set; }
}
