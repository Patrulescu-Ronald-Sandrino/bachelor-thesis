using API.Extensions;
using Application.Contracts;
using Application.DTOs.Attraction;
using Application.DTOs.Attraction.Query;
using Domain.Entities;
using Domain.Types;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class AttractionsController(IAttractionsService attractionsService) : BaseApiController
{
    [HttpGet]
    public async Task<List<AttractionDto>> GetAttractions([FromQuery] AttractionsQuery query)
    {
        var response = await attractionsService.GetAttractions(query);
        Response.AddPaginationHeader(response.PageData);
        return response;
    }

    [HttpGet("{id:guid}")]
    public async Task<AttractionDto> GetAttraction(Guid id)
    {
        return await attractionsService.GetAttraction(id);
    }

    [HttpPost]
    public async Task<ActionResult<Attraction>> CreateAttraction(Attraction attraction)
    {
        return await attractionsService.CreateAttraction(attraction);
    }

    [HttpPut]
    public async Task<AttractionDto> UpdateAttraction(Attraction attraction)
    {
        return await attractionsService.UpdateAttraction(attraction);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<Attraction>> DeleteAttraction(Guid id)
    {
        return await attractionsService.DeleteAttraction(id);
    }

    [HttpPut("{id:guid}/react")]
    public async Task<ActionResult> React(Guid id, ReactionTypes reactionType)
    {
        await attractionsService.React(id, reactionType);
        return NoContent();
    }
}
