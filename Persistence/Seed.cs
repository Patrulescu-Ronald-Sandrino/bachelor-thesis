using Domain.Entities;
using Domain.Types;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Persistence.Extensions;

namespace Persistence;

public static class Seed
{
    private const int AttractionsCount = 20;
    private static readonly string[] AttractionTypeNames = ["Museum", "Park", "Zoo", "Aquarium", "Amusement Park"];
    private static readonly string[] Usernames = ["bob", "tom", "jane"];

    private static readonly string[] Photos =
        ["https://i.imgur.com/7GgNR8y.jpeg", "https://i.imgur.com/MhiQZE0.png", "https://i.imgur.com/5qm6RFh.png"];

    private static readonly Random Random = new();
    private static readonly HttpClient HttpClient = new();

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
                configuration.GetOrThrow("PasswordAdmin"));
            var userAdmin = await userManager.FindByNameAsync(admin);
            await userManager.AddToRoleAsync(userAdmin!, nameof(UserRoles.Admin));

            // add regular users
            foreach (var (username, i) in Usernames.Select((username, i) => (username, i)))
            {
                var user = new User
                {
                    UserName = username, Email = $"{username}@test.com", PhotoUrl = Photos[i % Photos.Length],
                };
                await userManager.CreateAsync(user, configuration.GetOrThrow("PasswordUser"));
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
            var photos = await File.ReadAllLinesAsync(Path.Join("..", "Persistence", "pictures.txt"));
            attractionTypes ??= context.AttractionTypes.ToList();
            countries ??= context.Countries.ToList();

            var ids = GenerateOrderedIds(AttractionsCount);
            var users = await userManager.Users.ToListAsync();
            var descriptions = await RandomTexts();
            var attractions = Enumerable.Range(0, ids.Count).Select(i => new Attraction
            {
                Id = ids[i],
                Name = $"Attraction {i + 1:00}",
                Description = string.Join("\n\n", descriptions.OrderBy(_ => Random.Next()).Take(Random.Next(3))),
                Address = $"Address {i + 1:00}",
                Website = i % 2 == 0 ? "https://www.google.com" : "https://example.com/",
                City = $"City {i % 3 + 1}",
                CountryId = countries.ElementAt(Random.Next(context.Countries.Count())).Id,
                AttractionTypeId = attractionTypes.ElementAt(Random.Next(context.AttractionTypes.Count())).Id,
                CreatorId = users.ElementAt(i % users.Count).Id,
                Photos = photos.OrderBy(_ => Random.Next()).Take(Random.Next(5) + 1).ToList(),
            });

            await context.Attractions.AddRangeAsync(attractions);
            await context.Reactions.ExecuteDeleteAsync();
            await context.AttractionComments.ExecuteDeleteAsync();
            await context.SaveChangesAsync();
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

        if (!context.AttractionComments.Any())
        {
            List<AttractionComment> comments = [];
            var startCreatedBy = new DateTime(2000, 1, 1);
            var rangeCreatedBy = (DateTime.Now - startCreatedBy).Days;

            DateTime RandomDate()
            {
                return startCreatedBy.AddDays(Random.Next(rangeCreatedBy - 1))
                    .AddHours(Random.Next(24))
                    .AddMinutes(Random.Next(60))
                    .AddSeconds(Random.Next(60));
            }

            var texts = await RandomTexts();

            await foreach (var attraction in context.Attractions)
            foreach (var user in userManager.Users)
            {
                if (Random.Next(1 + 1) == 0) continue;

                comments.Add(new AttractionComment
                {
                    Attraction = attraction,
                    Author = user,
                    Body = string.Join("\n\n", texts.OrderBy(_ => Random.Next()).Take(Random.Next(2) + 1)),
                    CreatedAt = RandomDate(),
                });
            }

            if (comments.Count == 0) await SeedData(context, userManager, configuration);
            await context.AttractionComments.AddRangeAsync(comments);
        }

        var result = await context.SaveChangesAsync();
        Console.WriteLine($"Successfully seeded the database with {result} entities");

        return;

        static List<Guid> GenerateOrderedIds(int count) =>
            Enumerable.Range(0, count).Select(_ => Guid.NewGuid()).Order().ToList();
    }

    private static async Task<List<string>> RandomTexts()
    {
        return (await HttpClient.GetStringAsync("https://loripsum.net/api/plaintext/20")).Split("\n")
            .Where(x => x != "").ToList();
    }
}
