using System.Security.Claims;
using System.Text;
using API.DTOs;
using API.Services;
using Application.Contracts.Infrastructure;
using Application.Exceptions;
using Application.Util;
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

        if (!user.EmailConfirmed) throw new ValidationException("Email not confirmed");

        var result = await signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
        if (!result.Succeeded) return Unauthorized("Invalid email or password");

        return ToUserDto(user);
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto registerDto)
    {
        var user = new User { Email = registerDto.Email, UserName = registerDto.Username };

        var result = await userManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded)
        {
            var validator = new Validator();
            foreach (var error in result.Errors)
            {
                foreach (var field in new[] { "Username", "Email", "Password" })
                    if (error.Description.Contains(field))
                        validator.Add(field.ToLower(), error.Description);
            }

            validator.Run();
        }

        await userManager.AddToRoleAsync(user, UserRoles.Member.ToString());

        await SendEmailConfirmation(user);

        return Ok("Registration success - please verify email");
    }

    [AllowAnonymous]
    [HttpGet("resend-email-verification")]
    public async Task<IActionResult> ResendEmailVerification(string email)
    {
        var user = await GetUserForEmailVerification(email);
        await SendEmailConfirmation(user);
        return Ok("Email verification link resent");
    }

    private async Task<User> GetUserForEmailVerification(string email)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user == null) throw new ValidationException("Invalid email");

        if (user.EmailConfirmed) throw new ValidationException("Email already confirmed");
        return user;
    }

    private async Task SendEmailConfirmation(User user)
    {
        var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
        token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

        var verifyUrl = $"{Request.Headers.Origin}/verify-email?email={user.Email}&token={token}";
        var message =
            $"<p>Please click the below link to verify your email address:</p><p><a href='{verifyUrl}'>Click to verify email</a></p>";
        await emailSender.SendEmailAsync(user.Email, "Attractions - Please verify email", message);
    }

    [AllowAnonymous]
    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail(string email, string token)
    {
        var user = await GetUserForEmailVerification(email);

        var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));
        var result = await userManager.ConfirmEmailAsync(user, decodedToken);

        if (result.Errors.Any(x => x.Code == "InvalidToken")) throw new ValidationException("Invalid token");

        return Ok("Email confirmed - you can now login");
    }

    [AllowAnonymous]
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(string email)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user == null) throw new ValidationException("Invalid email");

        var token = await userManager.GeneratePasswordResetTokenAsync(user);
        token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

        var resetUrl = $"{Request.Headers.Origin}/reset-password?email={email}&token={token}";
        var message =
            $"<p>Please click the below link to reset your password:</p><p><a href='{resetUrl}'>Click to reset password</a></p>";
        await emailSender.SendEmailAsync(email, "Attractions - Reset password", message);

        return Ok("Password reset link sent");
    }

    [AllowAnonymous]
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordDto resetPasswordDto)
    {
        var user = await userManager.FindByEmailAsync(resetPasswordDto.Email);
        if (user == null) throw new ValidationException("Invalid email");

        var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(resetPasswordDto.Token));
        var result = await userManager.ResetPasswordAsync(user, decodedToken, resetPasswordDto.Password);

        if (result.Errors.Any(x => x.Code == "InvalidToken")) throw new ValidationException("Invalid token");

        return Ok("Password reset successful");
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
