using System.Text;
using API.Services;
using Application.Contracts;
using Application.Contracts.Infrastructure;
using Application.Core;
using Application.Logic;
using Application.Utils;
using Config;
using Domain.Entities;
using Infrastructure.Photos;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Persistence;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace API.Extensions;

public static class ApplicationServicesExtension
{
    public static void AddApplicationServices(this IServiceCollection services, ConfigurationManager configuration)
    {
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(SwaggerGenSetupAction);
        services.AddDbContext<DataContext>(options =>
        {
            options.UseSqlite(configuration.GetConnectionString("DefaultConnection"));
        });
        services.AddScoped<IAttractionTypesService, AttractionTypesService>();
        services.AddScoped<IAttractionsService, AttractionsService>();
        services.AddScoped<ICountryService, CountryService>();
        services.AddScoped<IUserAccessor, UserAccessor>();
        services.AddScoped<IPhotoAccessor, PhotoAccessor>();
        services.AddScoped<AuthUtils>();
        services.AddAutoMapper(typeof(MappingProfiles).Assembly);
        services.Configure<CloudinarySettings>(configuration.GetSection("Cloudinary"));
        services.AddSignalR();
    }

    private static void SwaggerGenSetupAction(SwaggerGenOptions options)
    {
        options.SwaggerDoc("v1", new OpenApiInfo { Title = "Attractions API", Version = "1" });
        SwaggerGenSecuritySetupAction(options);
    }

    private static void SwaggerGenSecuritySetupAction(SwaggerGenOptions options)
    {
        var jwtSecurityScheme = new OpenApiSecurityScheme
        {
            BearerFormat = "JWT",
            Name = "JWT Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.Http,
            Scheme = JwtBearerDefaults.AuthenticationScheme,
            Description = "Put **_ONLY_** your JWT Bearer token on textbox below!",
            Reference = new OpenApiReference
                { Id = JwtBearerDefaults.AuthenticationScheme, Type = ReferenceType.SecurityScheme }
        };

        options.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);

        options.AddSecurityRequirement(new OpenApiSecurityRequirement { { jwtSecurityScheme, Array.Empty<string>() } });
    }

    public static void AddIdentityServices(this IServiceCollection services, ConfigurationManager configuration,
        bool isDevelopment)
    {
        services.AddIdentityCore<User>(options =>
            {
                options.User.RequireUniqueEmail = true;

                options.Password.RequireNonAlphanumeric = false;
                if (!isDevelopment) return;
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredLength = 1;
            })
            .AddRoles<UserRole>()
            .AddEntityFrameworkStores<DataContext>()
            .AddSignInManager<SignInManager<User>>();

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration[ConfigKeys.TokenKey]!));

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                };
            });
        services.AddScoped<TokenService>();
    }
}
