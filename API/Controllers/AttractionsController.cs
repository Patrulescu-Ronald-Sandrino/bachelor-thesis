using API.Extensions;
using Application.Contracts;
using Application.DTOs.Attraction;
using Application.DTOs.Attraction.Query;
using Domain.Entities;
using Domain.Types;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class AttractionsController(
    IAttractionsService attractionsService,
    ICountryService countryService,
    IAttractionTypesService attractionTypesService) : BaseApiController
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
    public async Task<ActionResult<AttractionFormData>> CreateAttraction(AttractionDto attractionDto)
    {
        var attraction = await attractionsService.CreateAttraction(attractionDto);
        return await GetAttractionFormData(attraction.Id);
    }

    [HttpPut]
    public async Task<ActionResult<AttractionFormData>> UpdateAttraction(AttractionDto attractionDto)
    {
        await attractionsService.UpdateAttraction(attractionDto);
        return await GetAttractionFormData(attractionDto.Id);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<Attraction>> DeleteAttraction(Guid id)
    {
        return await attractionsService.DeleteAttraction(id);
    }

    [HttpGet("form-data/{id:guid?}")]
    public async Task<ActionResult<AttractionFormData>> GetAttractionFormData(Guid? id)
    {
        var taskCountries = countryService.GetCountries();
        var taskAttractionTypes = attractionTypesService.GetAttractionTypes();
        var taskAttraction = id.Map(attractionsService.GetAttraction, Task<AttractionDto>.Factory.StartNew(() => null));

        await Task.WhenAll(taskCountries, taskAttractionTypes, taskAttraction);

        return new AttractionFormData
        {
            Countries = taskCountries.Result,
            Types = taskAttractionTypes.Result,
            Attraction = taskAttraction.Result,
        };
    }


    [HttpPut("{id:guid}/react")]
    public async Task<ActionResult> React(Guid id, ReactionTypes reactionType)
    {
        await attractionsService.React(id, reactionType);
        return NoContent();
    }
}
