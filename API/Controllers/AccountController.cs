using System.Security.Claims;
using System.Text;
using API.DTOs;
using API.Services;
using Application.Contracts.Infrastructure;
using Domain.Entities;
using Domain.Types;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;

namespace API.Controllers;

public class AccountController(
    UserManager<User> userManager,
    SignInManager<User> signInManager,
    TokenService tokenService,
    IEmailSender emailSender)
    : BaseApiController
{
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await userManager.FindByEmailAsync(loginDto.Email);
        if (user == null) return Unauthorized("Invalid email or password");

        if (!user.EmailConfirmed) return Unauthorized("Email not confirmed");

        var result = await signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

        if (!result.Succeeded) return Unauthorized("Invalid email or password");

        return ToUserDto(user);
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto registerDto)
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

        if (!result.Succeeded) return BadRequest("Problem registering user");

        await SendEmailConfirmation(user);

        return Ok("Registration success - please verify email");
    }

    [AllowAnonymous]
    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail(string email, string token)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user == null) return Unauthorized("Invalid email");

        var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));
        var result = await userManager.ConfirmEmailAsync(user, decodedToken);

        if (!result.Succeeded) return BadRequest("Could not verify email address");

        return Ok("Email confirmed - you can now login");
    }

    [AllowAnonymous]
    [HttpGet("resend-email-confirmation")]
    public async Task<IActionResult> ResendEmailConfirmation(string email)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user == null) return Unauthorized("Invalid email");

        if (user.EmailConfirmed) return Ok("Email already confirmed");

        await SendEmailConfirmation(user);
        return Ok("Email verification link resent");
    }

    private async Task SendEmailConfirmation(User user)
    {
        var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
        token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

        var verifyUrl = $"{Request.Headers.Origin}/account/verify-email?email={user.Email}&token={token}";
        var message =
            $"<p>Please click the below link to verify your email address:</p><p><a href='{verifyUrl}'>Click to verify email</a></p>";
        await emailSender.SendEmailAsync(user.Email, "Attractions - Please verify email", message);
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
