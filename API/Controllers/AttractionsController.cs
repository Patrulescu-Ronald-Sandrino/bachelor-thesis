using Application.Contracts;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class AttractionsController(IAttractionsService attractionsService) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<Attraction>>> GetAttractions()
    {
        return await attractionsService.GetAttractions();
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Attraction>> GetAttraction(Guid id)
    {
        return await attractionsService.GetAttraction(id);
    }
}