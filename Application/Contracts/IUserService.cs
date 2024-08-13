using Application.DTOs;

namespace Application.Contracts;

public interface IUserService
{
    public Task<UserProfileDto> GetProfile(string username);
}
