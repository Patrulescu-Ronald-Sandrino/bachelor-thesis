using System.Net.Mime;
using System.Text.Json;
using Application.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace API.Middleware;

public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
{
    private static readonly JsonSerializerOptions JsonSerializerOptions =
        new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception e)
        {
            context.Response.ContentType = MediaTypeNames.Application.Json;
            var response = new ProblemDetails { Title = e.Message };

            switch (e)
            {
                case ForbiddenException:
                    response.Status = StatusCodes.Status403Forbidden;
                    break;
                case NotFoundException:
                    response.Status = StatusCodes.Status404NotFound;
                    break;
                case ValidationException ve:
                    response.Status = StatusCodes.Status422UnprocessableEntity;
                    if (ve.Errors.Count > 0) response.Extensions.Add("errors", ve.Errors);
                    break;
                default:
                {
                    logger.LogError(e, "");

                    response.Status = StatusCodes.Status500InternalServerError;
                    response.Detail = e.StackTrace;

                    if (!env.IsDevelopment())
                    {
                        response.Title = "Server error";
                        response.Detail = null;
                    }

                    break;
                }
            }

            context.Response.StatusCode = response.Status.Value;

            var json = JsonSerializer.Serialize(response, JsonSerializerOptions);

            await context.Response.WriteAsync(json);
        }
    }
}
