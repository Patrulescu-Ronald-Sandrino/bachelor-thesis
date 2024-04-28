using Domain;

namespace Application.Contracts;

public interface IAttractionsService
{
    public Task<List<Attraction>> GetAttractions();

    public Task<Attraction> GetAttraction(Guid id);
}