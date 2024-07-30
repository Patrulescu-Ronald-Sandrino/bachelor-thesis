using Config;
using Domain.Entities;
using Domain.Types;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Utils;

namespace Persistence;

public static class Seed
{
    private const int AttractionsCount = 20;
    private static readonly string[] AttractionTypeNames = ["Museum", "Park", "Zoo", "Aquarium", "Amusement Park"];
    private static readonly string[] Usernames = ["bob", "tom", "jane"];

    private static readonly string[] Photos =
        ["https://i.imgur.com/7GgNR8y.jpeg", "https://i.imgur.com/MhiQZE0.png", "https://i.imgur.com/5qm6RFh.png"];

    private static readonly Random Random = new();

    public static async Task SeedData(DataContext context, UserManager<User> userManager,
        ConfigurationManager configuration)
    {
        List<AttractionType> attractionTypes = null;
        List<Country> countries = null;

        if (!userManager.Users.Any())
        {
            // add admin user
            const string admin = "admin";
            await userManager.CreateAsync(
                new User
                {
                    UserName = admin, Email = $"{admin}@test.com", PhotoUrl = "https://i.imgur.com/ZHwzVZ2.png",
                },
                configuration.GetOrThrow(ConfigKeys.PasswordAdmin));
            var userAdmin = await userManager.FindByNameAsync(admin);
            await userManager.AddToRoleAsync(userAdmin!, nameof(UserRoles.Admin));

            // add regular users
            foreach (var (username, i) in Usernames.Select((username, i) => (username, i)))
            {
                var user = new User
                {
                    UserName = username, Email = $"{username}@test.com", PhotoUrl = Photos[i % Photos.Length],
                };
                await userManager.CreateAsync(user, configuration.GetOrThrow(ConfigKeys.PasswordUser));
                await userManager.AddToRoleAsync(user, UserRoles.Member.ToString());
            }
        }

        if (!context.AttractionTypes.Any())
        {
            var ids = GenerateOrderedIds(AttractionTypeNames.Length);
            attractionTypes = Enumerable.Range(0, AttractionTypeNames.Length)
                .Select(i => new AttractionType { Id = ids[i], Name = AttractionTypeNames[i] }).ToList();
            await context.AttractionTypes.AddRangeAsync(attractionTypes);
        }

        if (!context.Countries.Any())
        {
            var countryNames = File.ReadLines(Path.Join("..", "Domain", "Data", "countries.txt")).ToArray();
            var ids = GenerateOrderedIds(countryNames.Length);
            countries = Enumerable.Range(0, countryNames.Length)
                .Select(i => new Country { Id = ids[i], Name = countryNames[i] }).ToList();
            await context.Countries.AddRangeAsync(countries);
        }

        if (!context.Attractions.Any())
        {
            attractionTypes ??= context.AttractionTypes.ToList();
            countries ??= context.Countries.ToList();

            var ids = GenerateOrderedIds(AttractionsCount);
            var users = await userManager.Users.ToListAsync();
            var attractions = Enumerable.Range(0, ids.Count).Select(i => new Attraction
            {
                Id = ids[i],
                Name = $"Attraction {i + 1:00}",
                Description = $"Description {i + 1:00}",
                Address = $"Address {i + 1:00}",
                Website = i % 2 == 0 ? "https://www.google.com" : "https://example.com/",
                City = $"City {i % 3 + 1}",
                CountryId = countries.ElementAt(Random.Next(context.Countries.Count())).Id,
                AttractionTypeId = attractionTypes.ElementAt(Random.Next(context.AttractionTypes.Count())).Id,
                CreatorId = users.ElementAt(i % users.Count).Id,
            });

            await context.Attractions.AddRangeAsync(attractions);
        }

        if (!context.Reactions.Any())
        {
            List<Reaction> reactions = [];
            await foreach (var attraction in context.Attractions)
            foreach (var user in userManager.Users)
            {
                if (Random.Next(1 + 1) == 0) continue;

                reactions.Add(new Reaction
                {
                    AttractionId = attraction.Id,
                    UserId = user.Id,
                    Type = (ReactionType)Random.Next(Enum.GetValues<ReactionType>().Length),
                });
            }

            if (reactions.Count == 0) await SeedData(context, userManager, configuration);
            await context.Reactions.AddRangeAsync(reactions);
        }

        var result = await context.SaveChangesAsync();
        Console.WriteLine($"Successfully seeded the database with {result} entities");

        return;

        static List<Guid> GenerateOrderedIds(int count) =>
            Enumerable.Range(0, count).Select(_ => Guid.NewGuid()).Order().ToList();
    }
}
