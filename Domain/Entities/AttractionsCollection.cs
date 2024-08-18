using Domain.Types;

namespace Domain.Entities;

public class AttractionsCollection
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Thumbnail { get; set; }
    public Visibility Visibility { get; set; }
    public uint Index { get; set; }
    public Guid OwnerId { get; set; }

    public User Owner { get; set; }
    public List<AttractionsCollectionItem> CollectionItems { get; set; } = [];
}
