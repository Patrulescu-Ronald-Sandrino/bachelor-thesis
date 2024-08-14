using Application.DTOs;
using Microsoft.AspNetCore.Http;

namespace Application.Contracts;

public interface IUserService
{
    public Task<UserProfileDto> GetProfile(string username);
    public Task<string> ChangePhoto(IFormFile photo);
    Task DeletePhoto();
}
