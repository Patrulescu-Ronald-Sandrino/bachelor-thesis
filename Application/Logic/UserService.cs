using Application.Contracts;
using Application.DTOs;
using Application.Exceptions;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Logic;

public class UserService(DataContext context) : IUserService
{
    public async Task<UserProfileDto> GetProfile(string username)
    {
        var user = await context.Users.Where(u => u.UserName == username)
            .Include(user => user.CreatedAttractions)
            .Include(user => user.AttractionComments)
            .FirstOrDefaultAsync() ?? throw new NotFoundException();

        return new UserProfileDto
        {
            Username = user.UserName,
            Photo = user.Photo,
            CreatedAttractions = user.CreatedAttractions.Count,
            WrittenComments = user.AttractionComments.Count,
            Bio = user.Bio,
        };
    }
}
