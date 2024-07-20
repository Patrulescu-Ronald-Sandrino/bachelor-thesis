using System.Security.Claims;
using Application.Contracts.Infrastructure;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Security;

public class UserAccessor(IHttpContextAccessor httpContextAccessor) : IUserAccessor
{
    public string GetUsername()
    {
        return httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Name);
    }
}
