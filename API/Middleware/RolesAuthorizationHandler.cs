using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace API.Middleware;

public class RolesAuthorizationHandler(IHttpContextAccessor httpContextAccessor)
    : AuthorizationHandler<RolesAuthorizationRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context,
        RolesAuthorizationRequirement requirement)
    {
        var currentUser = context.User;

        if (requirement.AllowedRoles.Any(r => currentUser.IsInRole(r)))
        {
            context.Succeed(requirement);
        }
        else
        {
            var httpContext = httpContextAccessor.HttpContext;
            if (httpContext == null) throw new Exception("Not in an HTTP context");

            httpContext.Response.StatusCode = StatusCodes.Status403Forbidden;
            context.Fail();
        }

        return Task.CompletedTask;
    }
}
