using Config;
using Domain.Entities;
using Domain.Types;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Utils;

namespace Persistence;

public static class Seed
{
    private static readonly string[] Usernames = ["bob", "tom", "jane"];
    private static readonly string[] AttractionTypeNames = ["Museum", "Park", "Zoo", "Aquarium", "Amusement Park"];

    public static async Task SeedData(DataContext context, UserManager<User> userManager,
        ConfigurationManager configuration)
    {
        List<AttractionType> attractionTypes = null;
        List<Country> countries = null;

        if (!userManager.Users.Any())
        {
            foreach (var user in Usernames.Select(name => new User { UserName = name, Email = $"{name}@test.com" }))
            {
                await userManager.CreateAsync(user, configuration.GetOrThrow(ConfigKeys.PasswordUser));
                await userManager.AddToRoleAsync(user, UserRoles.Member.ToString());
            }

            const string admin = "admin";
            await userManager.CreateAsync(new User { UserName = admin, Email = $"{admin}@test.com" },
                configuration.GetOrThrow(ConfigKeys.PasswordAdmin));
            var userAdmin = await userManager.FindByNameAsync(admin);
            await userManager.AddToRoleAsync(userAdmin!, nameof(UserRoles.Admin));
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

            var random = new Random();
            var ids = GenerateOrderedIds(20);
            var attractions = Enumerable.Range(0, ids.Count).Select(i => new Attraction
            {
                Id = ids[i],
                Name = $"Attraction {i + 1:00}",
                Description = $"Description {i + 1:00}",
                Address = $"Address {i + 1:00}",
                Website = i % 2 == 0 ? "https://www.google.com" : "https://example.com/",
                City = $"City {i % 3 + 1}",
                CountryId = countries.ElementAt(random.Next(context.Countries.Count())).Id,
                AttractionTypeId = attractionTypes.ElementAt(random.Next(context.AttractionTypes.Count())).Id
            });

            await context.Attractions.AddRangeAsync(attractions);
        }

        await context.SaveChangesAsync();

        return;

        static List<Guid> GenerateOrderedIds(int count) =>
            Enumerable.Range(0, count).Select(_ => Guid.NewGuid()).Order().ToList();
    }
}
