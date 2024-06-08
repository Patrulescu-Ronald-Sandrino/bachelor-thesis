using Application.Contracts;
using Domain.Entities;
using Domain.Types;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class AttractionTypesController(IAttractionTypesService attractionTypesService) : BaseApiController
{
    [HttpGet]
    public async Task<List<AttractionType>> GetAttractionTypes()
    {
        return await attractionTypesService.GetAttractionTypes();
    }

    [HttpGet("{id:guid}")]
    public async Task<AttractionType> GetAttractionType(Guid id)
    {
        return await attractionTypesService.GetAttractionType(id);
    }

    [Authorize(Roles = nameof(UserRoles.Admin))]
    [HttpPost]
    public async Task<ActionResult<AttractionType>> CreateAttractionType(AttractionType attractionType)
    {
        return await attractionTypesService.CreateAttractionType(attractionType);
    }

    [Authorize(Roles = nameof(UserRoles.Admin))]
    [HttpPut]
    public async Task<AttractionType> UpdateAttractionType(AttractionType attractionType)
    {
        return await attractionTypesService.UpdateAttractionType(attractionType);
    }

    [Authorize(Roles = nameof(UserRoles.Admin))]
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<AttractionType>> DeleteAttractionType(Guid id)
    {
        return await attractionTypesService.DeleteAttractionType(id);
    }
}