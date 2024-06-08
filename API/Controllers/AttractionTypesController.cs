using Application.Contracts;
using Domain.Entities;
using Domain.Types;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize(Roles = nameof(UserRoles.Admin))]
public class AttractionTypesController(IAttractionTypesService attractionTypesService) : BaseApiController
{
    [HttpGet]
    public async Task<List<AttractionType>> GetAttractionTypes()
    {
        return await attractionTypesService.GetAttractionTypes();
    }

    [HttpGet("{id:guid}")]
    public async Task<AttractionType> GetAttraction(Guid id)
    {
        return await attractionTypesService.GetAttractionType(id);
    }

    [HttpPost]
    public async Task<ActionResult<AttractionType>> CreateAttraction(AttractionType attractionType)
    {
        return await attractionTypesService.CreateAttractionType(attractionType);
    }

    [HttpPut]
    public async Task<AttractionType> UpdateAttraction(AttractionType attractionType)
    {
        return await attractionTypesService.UpdateAttractionType(attractionType);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<AttractionType>> DeleteAttraction(Guid id)
    {
        return await attractionTypesService.DeleteAttractionType(id);
    }
}