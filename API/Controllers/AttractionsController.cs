using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers;

public class AttractionsController(DataContext context) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<Attraction>>> GetAttractions()
    {
        return await context.Attractions.ToListAsync();
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Attraction>> GetAttraction(Guid id)
    {
        return await context.Attractions.FindAsync(id);
    }
}