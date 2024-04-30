using Application.Contracts;
using Application.Core;
using Application.Logic;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extensions;

public static class ApplicationServicesExtension
{
    public static void AddApplicationServices(this IServiceCollection services, ConfigurationManager configuration)
    {
        services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
        services.AddDbContext<DataContext>(options =>
        {
            options.UseSqlite(configuration.GetConnectionString("DefaultConnection"));
        });
        services.AddScoped<IAttractionsService, AttractionsService>();
        services.AddAutoMapper(typeof(MappingProfiles).Assembly);
    }
}