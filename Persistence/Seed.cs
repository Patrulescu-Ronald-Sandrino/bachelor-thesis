using System.Collections.Immutable;
using System.Diagnostics;
using Domain;
using Domain.Entities;
using Domain.Types;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Persistence.Extensions;
using Persistence.Util;

namespace Persistence;

public static class Seed
{
    private static readonly string[] AttractionTypeNames = ["Museum", "Park", "Zoo", "Aquarium", "Amusement Park"];
    private static readonly string[] Usernames = ["bob", "tom", "jane"];

    private static readonly string[] Photos =
        ["https://i.imgur.com/1wkJifZ.png", "https://i.imgur.com/VZGtOMf.png", "https://i.imgur.com/akQ0DAu.png"];

    private static readonly Random Random = new();
    private static readonly HttpClient HttpClient = new();

    public static async Task SeedData(DataContext context, UserManager<User> userManager,
        ConfigurationManager configuration)
    {
        var stopwatch = Stopwatch.StartNew();

        var descriptions = await RandomTexts();
        List<AttractionType> attractionTypes = null;
        List<Country> countries = null;

        if (!userManager.Users.Any())
        {
            // add admin user
            const string admin = "admin";
            await userManager.CreateAsync(
                new User
                {
                    UserName = admin, Email = $"{admin}@test.com", Photo = "https://i.imgur.com/mutuyxN.png",
                    Bio = string.Join("\n\n", descriptions.OrderBy(_ => Random.Next()).Take(Random.Next(3))),
                    EmailConfirmed = true,
                },
                configuration.GetOrThrow("PasswordAdmin"));
            var userAdmin = await userManager.FindByNameAsync(admin);
            await userManager.AddToRoleAsync(userAdmin!, nameof(UserRoles.Admin));

            // add regular users
            foreach (var (username, i) in Usernames.Select((username, i) => (username, i)))
            {
                var user = new User
                {
                    UserName = username, Email = $"{username}@test.com", Photo = Photos[i % Photos.Length],
                    Bio = string.Join("\n\n", descriptions.OrderBy(_ => Random.Next()).Take(Random.Next(3))),
                    EmailConfirmed = true,
                };
                await userManager.CreateAsync(user, configuration.GetOrThrow("PasswordUser"));
                await userManager.AddToRoleAsync(user, UserRoles.Member.ToString());
            }

            // add generic users
            foreach (var i in Enumerable.Range(1, 20))
            {
                var user = new User
                {
                    UserName = $"user{i:00}", Email = $"user{i:00}@test.com", Photo = Photos[i % Photos.Length],
                    Bio = string.Join("\n\n", descriptions.OrderBy(_ => Random.Next()).Take(Random.Next(3))),
                    EmailConfirmed = true,
                };
                await userManager.CreateAsync(user, configuration.GetOrThrow("PasswordUser"));
                await userManager.AddToRoleAsync(user, UserRoles.Member.ToString());
            }
        }

        var users = await userManager.Users.ToListAsync();

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

            var ids = GenerateOrderedIds(20);
            var attractionsNew = Enumerable.Range(0, ids.Count).Select(i => new Attraction
            {
                Id = ids[i],
                Name = $"Attraction {i + 1:00}",
                Description = string.Join("\n\n", descriptions.OrderBy(_ => Random.Next()).Take(Random.Next(3))),
                Address = $"Address {i + 1:00}",
                Website = i % 2 == 0 ? "https://www.google.com" : "https://example.com/",
                City = $"City {i % 3 + 1}",
                CountryId = countries.ElementAt(Random.Next(countries.Count)).Id,
                AttractionTypeId = attractionTypes.ElementAt(Random.Next(attractionTypes.Count)).Id,
                CreatorId = users.ElementAt(i % users.Count).Id,
                Photos = photos.OrderBy(_ => Random.Next()).Take(Random.Next(5) + 1).ToList(),
            });

            await context.Attractions.AddRangeAsync(attractionsNew);
            await context.Reactions.ExecuteDeleteAsync();
            await context.AttractionComments.ExecuteDeleteAsync();
            await context.AttractionsCollections.ExecuteDeleteAsync();
            await context.SaveChangesAsync();
        }

        var attractions = await context.Attractions.ToListAsync();

        if (!context.Reactions.Any())
        {
            List<Reaction> reactions = [];
            foreach (var attraction in attractions)
            foreach (var user in users)
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

            await foreach (var attraction in context.Attractions)
            foreach (var user in users)
            {
                if (Random.Next(1 + 1) == 0) continue;

                comments.Add(new AttractionComment
                {
                    Attraction = attraction,
                    Author = user,
                    Body = string.Join("\n\n", descriptions.OrderBy(_ => Random.Next()).Take(Random.Next(2) + 1)),
                    CreatedAt = RandomDate(),
                });
            }

            if (comments.Count == 0) await SeedData(context, userManager, configuration);
            await context.AttractionComments.AddRangeAsync(comments);
        }


        if (!context.AttractionsCollections.Any())
        {
            List<AttractionsCollection> collections = [];

            foreach (var user in users)
            {
                var collectionsCount = Random.Next(10);

                foreach (var i in Enumerable.Range(1, collectionsCount))
                {
                    List<AttractionsCollectionItem> collectionItems = [];
                    var visibilities = EnumUtil.GetValues<Visibility>().ToList();
                    var collection = new AttractionsCollection
                    {
                        Name = $"Collection of {user.UserName} #{i}",
                        Description =
                            string.Join("\n\n", descriptions.OrderBy(_ => Random.Next()).Take(Random.Next(3))),
                        // Thumbnail is deferred
                        Visibility = visibilities.ElementAt(Random.Next(visibilities.Count)),
                        Index = Convert.ToUInt32(i),
                        OwnerId = user.Id,
                    };

                    collectionItems.AddRange(attractions.OrderBy(_ => Random.Next()).Take(Random.Next(10)).Select(
                        (a, j) => new AttractionsCollectionItem
                        {
                            AttractionId = a.Id,
                            Attraction = a,
                            Note = string.Join("\n\n", descriptions.OrderBy(_ => Random.Next()).Take(Random.Next(3))),
                            Index = Convert.ToUInt32(j),
                        }));

                    collection.CollectionItems = collectionItems;
                    collection.Thumbnail = collectionItems.Select(ci => ci.Attraction.Photos.FirstOrDefault())
                        .FirstOrDefault();

                    collections.Add(collection);
                }
            }

            await context.AttractionsCollections.AddRangeAsync(collections);
        }

        if (!context.Friendships.Any())
        {
            var friendshipTypes = new List<FriendshipStatus?> { null }
                .Concat(EnumUtil.GetValues<FriendshipStatus>().Select(x => (FriendshipStatus?)x)).ToImmutableList();
            List<Friendship> friendships = [];

            // (n^2 - n)/2 friendships
            for (var i = 0; i < users.Count; i++)
            for (var j = i + 1; j < users.Count; j++)
            {
                var friendshipType = friendshipTypes.ElementAt(Random.Next(friendshipTypes.Count));
                if (friendshipType == null) continue;
                friendships.Add(new Friendship
                {
                    SenderId = users[i].Id,
                    ReceiverId = users[j].Id,
                    Status = friendshipType.Value,
                    ModifiedAt = RandomDate(),
                });
            }

            await context.Friendships.AddRangeAsync(friendships);
        }

        var result = await context.SaveChangesAsync();
        stopwatch.Stop();
        Console.WriteLine(
            $"Successfully seeded the database with {result} entities in {stopwatch.ElapsedMilliseconds / 1000:F3}s");

        return;

        static List<Guid> GenerateOrderedIds(int count)
        {
            return Enumerable.Range(0, count).Select(_ => Guid.NewGuid()).Order().ToList();
        }
    }

    private static async Task<List<string>> RandomTexts()
    {
        return (await HttpClient.GetStringAsync("https://loripsum.net/api/plaintext/20")).Split("\n")
            .Where(x => x != "").ToList();
    }

    #region random date

    private static readonly DateTime Now = DateTime.UtcNow;
    private static readonly DateTime StartCreatedAt = Now.AddYears(-2);
    private static readonly int RangeCreatedBy = (Now - StartCreatedAt).Days;

    private static DateTime RandomDate()
    {
        return StartCreatedAt.AddDays(Random.Next(RangeCreatedBy - 1))
            .AddHours(RandomInt(TimeSpan.FromDays(1).TotalHours))
            .AddMinutes(RandomInt(TimeSpan.FromHours(1).TotalMinutes))
            .AddSeconds(RandomInt(TimeSpan.FromMinutes(1).TotalSeconds))
            .AddMilliseconds(RandomInt(TimeSpan.FromSeconds(1).TotalMilliseconds))
            .AddMicroseconds(RandomInt(TimeSpan.FromMilliseconds(1).TotalMicroseconds));

        int RandomInt(double timeSpan)
        {
            return Random.Next(Convert.ToInt32(timeSpan));
        }
    }

    #endregion
}
