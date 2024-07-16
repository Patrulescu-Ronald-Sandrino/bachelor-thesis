using Domain.Entities;
using Domain.Types;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Utils;

namespace Persistence;

public class DataContext(DbContextOptions options) : IdentityDbContext<User, UserRole, Guid>(options)
{
    public DbSet<AttractionType> AttractionTypes { get; init; }
    public DbSet<Attraction> Attractions { get; init; }
    public DbSet<Country> Countries { get; init; }
    public DbSet<Reaction> Reactions { get; init; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        var roleTypes = EnumUtils.GetValues<UserRoles>().ToArray();
        var userRoles = Enumerable.Range(0, roleTypes.Length).Select(i => new UserRole
            {
                Id = Guid.Empty.OfChar((char)(roleTypes[i] + '0')),
                Name = roleTypes[i].ToString(),
                NormalizedName = roleTypes[i].ToString().ToUpper()
            })
            .ToArray();
        builder.Entity<UserRole>()
            .HasData(userRoles);

        builder.Entity<Attraction>()
            .HasOne(a => a.AttractionType)
            .WithMany()
            .HasForeignKey(a => a.AttractionTypeId)
            .IsRequired();

        builder.Entity<Attraction>()
            .HasOne(a => a.Country)
            .WithMany()
            .HasForeignKey(a => a.CountryId)
            .IsRequired();

        builder.Entity<Attraction>()
            .HasOne(a => a.Creator)
            .WithMany()
            .HasForeignKey(a => a.CreatorId)
            .IsRequired();

        builder.Entity<AttractionType>()
            .HasIndex(at => at.Name)
            .IsUnique();

        builder.Entity<Reaction>(x =>
        {
            x.HasKey(r => new { r.UserId, r.AttractionId });
            x.Property(r => r.Type).HasConversion<string>();
        });
    }
}
