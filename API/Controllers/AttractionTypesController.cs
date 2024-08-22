using Application.Contracts;
using Application.DTOs;
using Domain.Types;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class AttractionTypesController(IAttractionTypesService attractionTypesService) : BaseApiController
{
    [HttpGet]
    public async Task<List<AttractionTypeDto>> Get()
    {
        return await attractionTypesService.Get();
    }

    [HttpGet("{id:guid}")]
    public async Task<AttractionTypeDto> Find(Guid id)
    {
        return await attractionTypesService.Find(id);
    }

    [Authorize(Roles = nameof(UserRoles.Admin))]
    [HttpPost]
    public async Task<AttractionTypeDto> Add([FromQuery] string name)
    {
        return await attractionTypesService.Add(name);
    }

    [Authorize(Roles = nameof(UserRoles.Admin))]
    [HttpPut]
    public async Task<AttractionTypeDto> Update(AttractionTypeDto attractionTypeDto)
    {
        return await attractionTypesService.Update(attractionTypeDto);
    }

    [Authorize(Roles = nameof(UserRoles.Admin))]
    [HttpDelete("{id:guid}")]
    public async Task<AttractionTypeDto> Delete(Guid id)
    {
        return await attractionTypesService.Delete(id);
    }
}
