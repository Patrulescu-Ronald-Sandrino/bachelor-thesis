namespace Application.DTOs;

public class AttractionDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Address { get; set; }
    public string Website { get; set; }
    public string City { get; set; }
    public string Country { get; set; }
    public string AttractionType { get; set; }
}