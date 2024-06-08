using Application.Contracts;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Logic;

public class CountryService(DataContext context) : ICountryService
{
    public async Task<List<Country>> GetCountries()
    {
        return await context.Countries.ToListAsync();
    }
}