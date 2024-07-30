using Domain.Types;

namespace Application.DTOs.Attraction;

public class AttractionDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Address { get; set; }
    public string Website { get; set; }
    public string City { get; set; }
    public Guid CountryId { get; set; }
    public string Country { get; set; }
    public Guid AttractionTypeId { get; set; }
    public string AttractionType { get; set; }
    public Guid CreatorId { get; set; }
    public string[] Photos { get; set; }
    public ReactionType? Reaction { get; set; }
}
