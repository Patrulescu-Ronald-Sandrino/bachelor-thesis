using Domain;

namespace Persistence;

public static class Seed
{
    public static async Task SeedData(DataContext context)
    {
        if (context.Attractions.Any()) return;

        var random = new Random();
        var cities = Enumerable.Range(0, 5).Select(_ => Guid.NewGuid()).ToList();
        var attractions = Enumerable.Range(0, 20).Select(i => new Attraction
        {
            Id = Guid.NewGuid(),
            Name = $"Attraction {i + 1:00}",
            Description = $"Description {i + 1:00}",
            CityId = cities[random.Next(0, cities.Count)],
            Address = $"Address {i + 1:00}",
            Website = i == 0 ? "https://www.google.com" : "https://example.com/",
            MainPictureUrl = $"https://picsum.photos/{i}/5000/3333",
        });

        await context.Attractions.AddRangeAsync(attractions);
        await context.SaveChangesAsync();
    }
}