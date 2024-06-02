using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class DataContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
    public DbSet<Attraction> Attractions { get; init; }
}