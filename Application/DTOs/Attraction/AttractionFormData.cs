using Domain.Entities;

namespace Application.DTOs.Attraction;

public class AttractionFormData
{
    public List<Country> Countries { get; set; }
    public List<AttractionTypeDto> Types { get; set; }
    public AttractionDto Attraction { get; set; }
}
