using Domain;

namespace Persistence;

public static class Seed
{
    public static async Task SeedData(DataContext context)
    {
        if (context.Attractions.Any()) return;

        const int count = 20;
        var random = new Random();
        var ids = Enumerable.Range(0, count).Select(_ => Guid.NewGuid()).Order().ToList();
        var cities = Enumerable.Range(0, 5).Select(_ => Guid.NewGuid()).ToList();
        var pictures = new[]
        {
            "https://images.pexels.com/photos/258196/pexels-photo-258196.jpeg",
            "https://images.pexels.com/photos/161985/alabama-rikard-s-mill-structure-wooden-161985.jpeg",
            "https://images.pexels.com/photos/208766/pexels-photo-208766.jpeg",
            "https://images.pexels.com/photos/258134/pexels-photo-258134.jpeg",
            "https://images.pexels.com/photos/14151333/pexels-photo-14151333.jpeg",
        };
        var attractions = Enumerable.Range(0, count).Select(i => new Attraction
        {
            Id = ids[i],
            Name = $"Attraction {i + 1:00}",
            Description = $"Description {i + 1:00}",
            CityId = cities[random.Next(0, cities.Count)],
            Address = $"Address {i + 1:00}",
            Website = i == 0 ? "https://www.google.com" : "https://example.com/",
            MainPictureUrl = pictures[i % pictures.Length],
        });

        await context.Attractions.AddRangeAsync(attractions);
        await context.SaveChangesAsync();
    }
}