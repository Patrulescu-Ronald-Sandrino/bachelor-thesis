namespace Application.DTOs.Attraction;

public class AttractionAddOrEditDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Address { get; set; }
    public string Website { get; set; }
    public string City { get; set; }
    public Guid CountryId { get; set; }
    public Guid AttractionTypeId { get; set; }
    public AttractionPhotosDto[] Photos { get; set; }
}
