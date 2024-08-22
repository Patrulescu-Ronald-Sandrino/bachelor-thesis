using Application.Contracts;
using Application.Contracts.Infrastructure;
using Application.DTOs;
using Application.DTOs.Friendship;
using Application.Exceptions;
using Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Logic;

public class UserService(DataContext context, AuthUtil authUtil, IPhotoAccessor photoAccessor) : IUserService
{
    public async Task<UserProfileDto> GetProfile(string username)
    {
        var currentUserId = await authUtil.GetCurrentUserId();
        var user = await context.Users.Where(u => u.UserName == username)
            .Include(user => user.CreatedAttractions)
            .Include(user => user.AttractionComments)
            .Include(user => user.FriendshipsSent.Where(f => f.ReceiverId == currentUserId))
            .Include(user => user.FriendshipsReceived.Where(f => f.SenderId == currentUserId))
            .FirstOrDefaultAsync() ?? throw new NotFoundException();

        var friendshipStatus = FriendshipStatusDto.None;
        var friendshipSent = user.FriendshipsSent.FirstOrDefault();
        var friendshipReceived = user.FriendshipsReceived.FirstOrDefault();
        if (friendshipSent != null)
            friendshipStatus = friendshipSent.Status == FriendshipStatus.Accepted
                ? FriendshipStatusDto.Accepted
                : FriendshipStatusDto.Received;
        if (friendshipReceived != null)
            friendshipStatus = friendshipReceived.Status == FriendshipStatus.Accepted
                ? FriendshipStatusDto.Accepted
                : FriendshipStatusDto.Requested;

        return new UserProfileDto
        {
            Username = user.UserName,
            Photo = user.Photo,
            CreatedAttractions = user.CreatedAttractions.Count,
            WrittenComments = user.AttractionComments.Count,
            Bio = user.Bio,
            FriendshipStatus = friendshipStatus,
        };
    }

    public async Task<string> ChangePhoto(IFormFile photo)
    {
        var user = await authUtil.GetCurrentUser();

        if (user.Photo != null) await photoAccessor.DeletePhotos([user.Photo]);

        var photoUrl = await photoAccessor.UploadPhoto(photo);

        user.Photo = photoUrl;
        var success = await context.SaveChangesAsync() > 0;

        return success ? photoUrl : throw new Exception("Problem saving changes");
    }

    public async Task DeletePhoto()
    {
        var user = await authUtil.GetCurrentUser();

        if (user.Photo == null) return;
        await photoAccessor.DeletePhotos([user.Photo]);

        user.Photo = null;
        var success = await context.SaveChangesAsync() > 0;

        if (!success) throw new Exception("Problem saving changes");
    }

    public async Task UpdateBio(string bio)
    {
        var user = await authUtil.GetCurrentUser();

        if (bio == user.Bio) return;

        user.Bio = bio;
        var success = await context.SaveChangesAsync() > 0;

        if (!success) throw new Exception("Problem saving changes");
    }
}
