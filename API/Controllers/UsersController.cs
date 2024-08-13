using Application.Contracts;
using Application.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class UsersController(IUserService userService) : BaseApiController
{
    [HttpGet("{username}")]
    public async Task<UserProfileDto> GetProfile(string username)
    {
        return await userService.GetProfile(username);
    }
}
