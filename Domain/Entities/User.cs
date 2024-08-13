using Microsoft.AspNetCore.Identity;

namespace Domain.Entities;

public class User : IdentityUser<Guid>
{
    public string Bio { get; set; }
    public string Photo { get; set; }

    public ICollection<Attraction> CreatedAttractions { get; set; } = [];

    public ICollection<AttractionComment> AttractionComments { get; set; } = [];
}
