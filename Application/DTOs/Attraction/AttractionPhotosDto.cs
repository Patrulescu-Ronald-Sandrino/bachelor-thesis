using Microsoft.AspNetCore.Http;

namespace Application.DTOs.Attraction;

public class AttractionPhotosDto
{
    public IFormFile NewPhoto { get; set; }
    public string CurrentUrl { get; set; }
}
