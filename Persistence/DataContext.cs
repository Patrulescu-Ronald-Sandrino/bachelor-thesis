using Domain;
using Domain.Entities;
using Domain.Types;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Persistence.Extensions;
using Persistence.Util;

namespace Persistence;

public class DataContext(DbContextOptions options) : IdentityDbContext<User, UserRole, Guid>(options)
{
    public DbSet<AttractionType> AttractionTypes { get; init; }
    public DbSet<Attraction> Attractions { get; init; }
    public DbSet<Country> Countries { get; init; }
    public DbSet<Reaction> Reactions { get; init; }
    public DbSet<AttractionComment> AttractionComments { get; init; }
    public DbSet<AttractionsCollection> AttractionsCollections { get; init; }
    public DbSet<AttractionsCollectionItem> AttractionsCollectionsItems { get; init; }
    public DbSet<Friendship> Friendships { get; init; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        var roleTypes = EnumUtil.GetValues<UserRoles>().ToArray();
        var userRoles = Enumerable.Range(0, roleTypes.Length).Select(i => new UserRole
            {
                Id = Guid.Empty.OfChar((char)(roleTypes[i] + '0')),
                Name = roleTypes[i].ToString(),
                NormalizedName = roleTypes[i].ToString().ToUpper()
            })
            .ToArray();

        builder.Entity<UserRole>(b =>
        {
            b.HasData(userRoles);

            b.Wrapper().HasEnumValueCheckConstraint<UserRoles>(nameof(UserRole.Name));
        });

        builder.Entity<Attraction>(b =>
        {
            b.HasOne(a => a.AttractionType)
                .WithMany(at => at.Attractions)
                .HasForeignKey(a => a.AttractionTypeId)
                .IsRequired();

            b.HasOne(a => a.Country)
                .WithMany()
                .HasForeignKey(a => a.CountryId)
                .IsRequired();

            b.HasOne(a => a.Creator)
                .WithMany(u => u.CreatedAttractions)
                .HasForeignKey(a => a.CreatorId)
                .IsRequired();

            b.Ignore(a => a.Photos)
                .Property(a => a.PhotosCsv)
                .IsRequired()
                .HasDefaultValue("");
        });

        builder.Entity<AttractionType>()
            .HasIndex(at => at.Name)
            .IsUnique();

        builder.Entity<Reaction>(b =>
        {
            b.HasKey(r => new { r.UserId, r.AttractionId });

            b.Property(r => r.Type).HasConversion<string>().IsRequired();
            b.Wrapper().HasEnumValueCheckConstraint<ReactionType>(nameof(Reaction.Type));
        });

        builder.Entity<AttractionComment>(b =>
        {
            b.HasOne(c => c.Attraction)
                .WithMany(a => a.Comments)
                .OnDelete(DeleteBehavior.Cascade);

            b.HasOne(c => c.Author)
                .WithMany(u => u.AttractionComments);
        });

        SetUpAttractionsCollections(builder);

        SetUpFriendships(builder);
    }

    private static void SetUpAttractionsCollections(ModelBuilder builder)
    {
        builder.Entity<AttractionsCollection>(b =>
        {
            b.Property(c => c.Name).IsRequired();
            b.Property(c => c.Description).IsRequired();

            b.HasOne(c => c.Owner)
                .WithMany()
                .HasForeignKey(c => c.OwnerId);

            b.Property(c => c.Visibility)
                .HasConversion<string>()
                .IsRequired();

            b.Wrapper().HasEnumValueCheckConstraint<Visibility>(nameof(AttractionsCollection.Visibility));

            b.HasIndex(c => new { c.Id, c.OwnerId, c.Index }).IsUnique();
        });

        builder.Entity<AttractionsCollectionItem>(b =>
        {
            b.HasOne(i => i.Collection)
                .WithMany(c => c.CollectionItems)
                .HasForeignKey(c => c.CollectionId)
                .OnDelete(DeleteBehavior.Cascade);

            b.HasOne(i => i.Attraction)
                .WithMany()
                .HasForeignKey(i => i.AttractionId);

            b.HasKey(i => new { i.CollectionId, i.AttractionId });

            b.HasIndex(ci => new { ci.CollectionId, ci.AttractionId }).IsUnique();
            b.HasIndex(ci => new { ci.CollectionId, ci.AttractionId, ci.Index }).IsUnique();
        });
    }

    private static void SetUpFriendships(ModelBuilder builder)
    {
        builder.Entity<Friendship>(b =>
        {
            b.HasKey(f => new { f.SenderId, f.ReceiverId });

            b.HasOne(f => f.Sender)
                .WithMany(u => u.FriendshipsSent)
                .HasForeignKey(f => f.SenderId);

            b.HasOne(f => f.Receiver)
                .WithMany(u => u.FriendshipsReceived)
                .HasForeignKey(f => f.ReceiverId);

            b.Property(f => f.Status).HasConversion<string>().IsRequired();
            b.Wrapper().HasEnumValueCheckConstraint<FriendshipStatus>(nameof(Friendship.Status));

            b.ToTable(tb => tb.HasCheckConstraint("NoSelfFriendship", "SenderId <> ReceiverId"));
        });
    }
}
