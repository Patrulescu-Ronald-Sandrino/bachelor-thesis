using System.Text.Json.Serialization;
using API.Extensions;
using API.Formatters;
using API.Middleware;
using API.SignalR;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// Add services to the container.

builder.Services.AddControllers(options =>
    {
        var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
        options.Filters.Add(new AuthorizeFilter(policy));

        options.InputFormatters.Add(new StringInputFormatter());
        options.AllowEmptyInputInBodyModelBinding = true;
    })
    .AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddApplicationServices(configuration);
builder.Services.AddIdentityServices(configuration, builder.Environment.IsDevelopment());

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => { c.ConfigObject.AdditionalItems.Add("persistAuthorization", "true"); });
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors(options =>
{
    options.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:4000");
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToController("Index", "Fallback");

app.MapHub<ChatHub>("/chat");

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

// try
// {
//     var connection = new MySqlConnection("Database=attractions; Server=localhost;User ID=root;Password=1234");
//     connection.Open();
//     await using var command = new MySqlCommand("SELECT * FROM test;", connection);
//     await using var reader = await command.ExecuteReaderAsync();
//     while (await reader.ReadAsync())
//     {
//         var value = reader.GetValue(0);
//         Console.WriteLine($"value = {value}");
//         // do something with 'value'
//     }
//
//     Console.WriteLine(connection);
//     Console.WriteLine("Exiting");
//     return;
// }
// ex.Number = 1042 when the server isn't up yet, assuming you're using MySql.Data and not some other MySql implementation
// catch (MySqlException ex) when (ex.Number is 1042)
// {
//     Console.Error.WriteLine("Waiting for db.");
//     Thread.Sleep(1000);
// }


try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<User>>();
    await context.Database.MigrateAsync();
    await Seed.SeedData(context, userManager, configuration);
}
catch (Exception e)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(e, "An error occurred during migration.");
}

app.Run();
