namespace Domain;

public class Attraction
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public Guid CityId { get; set; }
    public string Address { get; set; }
    public string Website { get; set; }
    public string MainPictureUrl { get; set; }
}