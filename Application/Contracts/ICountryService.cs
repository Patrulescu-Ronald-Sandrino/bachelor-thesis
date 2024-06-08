using Domain.Entities;

namespace Application.Contracts;

public interface ICountryService
{
    public Task<List<Country>> GetCountries();
}