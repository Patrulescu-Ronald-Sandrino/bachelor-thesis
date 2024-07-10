using System.Text.Json;
using Application.DTOs.Pagination;
using Microsoft.Net.Http.Headers;

namespace API.Extensions;

public static class HttpExtensions
{
    private static readonly JsonSerializerOptions JsonSerializerOptions =
        new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    public static void AddPaginationHeader(this HttpResponse response, PageData pageData)
    {
        const string paginationHeader = "Pagination"; // used by frontend

        response.Headers.Append(paginationHeader, JsonSerializer.Serialize(pageData, JsonSerializerOptions));
        response.Headers.Append(HeaderNames.AccessControlExposeHeaders, paginationHeader);
    }
}
