using Application.Contracts;
using Application.Contracts.Infrastructure;
using Application.DTOs;
using Application.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Logic;

public class UserService(DataContext context, AuthUtil authUtil, IPhotoAccessor photoAccessor) : IUserService
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

    public async Task<string> ChangePhoto(IFormFile photo)
    {
        var user = authUtil.GetCurrentUser();

        if (user.Photo != null) await photoAccessor.DeletePhotos([user.Photo]);

        var photoUrl = await photoAccessor.UploadPhoto(photo);

        user.Photo = photoUrl;
        var success = await context.SaveChangesAsync() > 0;

        return success ? photoUrl : throw new Exception("Problem saving changes");
    }

    public async Task DeletePhoto()
    {
        var user = authUtil.GetCurrentUser();

        if (user.Photo == null) return;
        await photoAccessor.DeletePhotos([user.Photo]);

        user.Photo = null;
        var success = await context.SaveChangesAsync() > 0;

        if (!success) throw new Exception("Problem saving changes");
    }

    public async Task UpdateBio(string bio)
    {
        var user = authUtil.GetCurrentUser();

        if (bio == user.Bio) return;

        user.Bio = bio;
        var success = await context.SaveChangesAsync() > 0;

        if (!success) throw new Exception("Problem saving changes");
    }
}
