namespace Domain.Entities;

public class AttractionsCollectionItem
{
    public Guid CollectionId { get; set; }
    public Guid AttractionId { get; set; }
    public string Note { get; set; }
    public uint Index { get; set; }

    public AttractionsCollection Collection { get; set; }
    public Attraction Attraction { get; set; }
}
