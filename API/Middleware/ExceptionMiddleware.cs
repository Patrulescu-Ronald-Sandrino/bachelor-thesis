using System.Net.Mime;
using System.Text.Json;
using Domain.Exceptions;
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
            var response = new ProblemDetails();
            logger.LogError(e, "");
            context.Response.ContentType = MediaTypeNames.Application.Json;

            response.Title = e.Message;

            switch (e)
            {
                case ForbiddenException:
                    response.Status = StatusCodes.Status403Forbidden;
                    break;
                case BadRequestException:
                    response.Status = StatusCodes.Status400BadRequest;
                    break;
                case NotFoundException:
                    response.Status = StatusCodes.Status404NotFound;
                    break;
                case ValidationException ve:
                    response.Status = StatusCodes.Status422UnprocessableEntity;
                    response.Extensions.Add("errors", ve.Errors);
                    break;
                default:
                {
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
