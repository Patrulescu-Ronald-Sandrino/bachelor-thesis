using Application.Contracts;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class CountriesController(ICountryService countryService) : BaseApiController
{
    [HttpGet]
    public async Task<List<Country>> GetCountries()
    {
        return await countryService.GetCountries();
    }
}