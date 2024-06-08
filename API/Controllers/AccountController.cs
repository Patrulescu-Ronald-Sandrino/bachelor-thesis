using System.Security.Claims;
using API.DTOs;
using API.Services;
using Domain.Entities;
using Domain.Types;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(
    UserManager<User> userManager,
    SignInManager<User> signInManager,
    TokenService tokenService)
    : BaseApiController
{
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await userManager.FindByEmailAsync(loginDto.Email);

        if (user == null) return Unauthorized("Invalid email");

        var result = await signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

        if (!result.Succeeded) return Unauthorized();

        return new UserDto
        {
            Username = user.UserName,
            Email = user.Email,
            Token = tokenService.CreateToken(user),
            Image = null,
        };
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        var existingUser =
            await userManager.Users.FirstOrDefaultAsync(x =>
                x.Email == registerDto.Email || x.UserName == registerDto.Username);

        if (existingUser != null)
        {
            var message = "";
            if (existingUser.Email == registerDto.Email) message += "Email taken.";
            if (existingUser.UserName == registerDto.Username) message += " Username taken.";
            return BadRequest(message);
        }

        var user = new User
        {
            Email = registerDto.Email,
            UserName = registerDto.Username,
        };

        var result = await userManager.CreateAsync(user, registerDto.Password);

        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(user, UserRoles.Member.ToString());
        }

        return !result.Succeeded ? BadRequest("Problem registering user") : ToUserDto(user);
    }

    [HttpGet]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var user = await userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email)!);

        return ToUserDto(user);
    }

    private ActionResult<UserDto> ToUserDto(User user)
    {
        return new UserDto
        {
            Username = user.UserName,
            Email = user.Email,
            Token = tokenService.CreateToken(user),
            Image = null,
        };
    }
}