using Domain;

namespace Application.Contracts;

public interface IAttractionsService
{
    public Task<List<Attraction>> GetAttractions();

    public Task<Attraction> GetAttraction(Guid id);

    public Task<Attraction> CreateAttraction(Attraction attraction);

    public Task<Attraction> UpdateAttraction(Attraction attraction);

    public Task<Attraction> DeleteAttraction(Guid id);
}