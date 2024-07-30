namespace Domain.Entities;

public class Attraction
{
    private const char PhotoCsvSeparator = ',';
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Address { get; set; }
    public string Website { get; set; }
    public string City { get; set; }

    public Guid CountryId { get; set; }
    public Country Country { get; set; }

    public Guid AttractionTypeId { get; set; }
    public AttractionType AttractionType { get; set; }

    public Guid CreatorId { get; set; }
    public User Creator { get; set; }

    public string PhotosCsv { get; private set; } = string.Empty;

    public List<string> Photos
    {
        get => PhotosCsv.Split(PhotoCsvSeparator).Where(x => x != string.Empty).ToList();
        set => PhotosCsv = string.Join(PhotoCsvSeparator, value);
    }

    public List<Reaction> Reactions { get; set; } = [];
}
