using System.Security.Claims;
using API.DTOs;
using API.Services;
using Domain.Entities;
using Domain.Types;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

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

        if (user == null) return Unauthorized();

        var result = await signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

        if (!result.Succeeded) return Unauthorized();

        return ToUserDto(user);
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        var user = new User { Email = registerDto.Email, UserName = registerDto.Username, };

        var result = await userManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem();
        }

        await userManager.AddToRoleAsync(user, UserRoles.Member.ToString());

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
            Image = user.PhotoUrl,
        };
    }
}
