using System.ComponentModel.DataAnnotations;
using Domain.Types;

namespace Application.DTOs;

public class AttractionsCollectionDto
{
    public Guid Id { get; set; }
    [Required] public string Name { get; set; }
    [Required] public string Description { get; set; }
    public string Thumbnail { get; set; }
    [Required] public Visibility Visibility { get; set; }
    public List<AttractionsCollectionItemDto> Items { get; set; }
}
