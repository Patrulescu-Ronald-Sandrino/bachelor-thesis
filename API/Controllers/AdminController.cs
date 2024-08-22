using Application.Contracts;
using Domain.Types;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize(Roles = nameof(UserRoles.Admin))]
public class AdminController(IAdminService adminService) : BaseApiController
{
    [HttpDelete("users/{username}")]
    public async Task DeleteUser(string username)
    {
        await adminService.DeleteUser(username);
    }
}
