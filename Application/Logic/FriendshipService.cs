using System.Collections.Immutable;
using Application.Contracts;
using Application.DTOs.Friendship;
using Application.Exceptions;
using Application.Logic.Extensions;
using Domain.Entities;
using Domain.Types;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Logic;

public class FriendshipService(DataContext context, AuthUtil authUtil) : IFriendshipService
{
    public async Task<Dictionary<FriendshipStatusDto, List<FriendshipDto>>> GetFriendships(string username)
    {
        var currentUser = await authUtil.GetCurrentUser();
        var currentUserId = currentUser.Id;
        var result = new Dictionary<FriendshipStatusDto, List<FriendshipDto>>();

        var friendships = await context.Friendships
            .Include(f => f.Sender)
            .Include(f => f.Receiver)
            .Where(f =>
                f.SenderId == currentUserId || f.ReceiverId == currentUserId ||
                f.Sender.UserName == username || f.Receiver.UserName == username).OrderBy(f => f.ModifiedAt)
            .ToListAsync();

        var dictionaryAsync = friendships.GroupBy(
                f => new HashSet<string> { f.Sender.UserName, f.Receiver.UserName }.Contains(username), f => f,
                (forUsername, enumerable) => new { forUsername, enumerable })
            .ToImmutableDictionary(x => x.forUsername, x => x.enumerable);

        var friendshipsOfUsername = dictionaryAsync.TryGetValue(true, out var valueTrue) ? valueTrue.ToList() : [];
        var friendshipsOfCurrentUser =
            dictionaryAsync.TryGetValue(false, out var valueFalse) ? valueFalse.ToList() : [];

        var isSelf = currentUser.UserName == username;
        if (isSelf) friendshipsOfCurrentUser.AddRange(friendshipsOfUsername);


        foreach (var friendshipOfUsername in friendshipsOfUsername)
        {
            // determine the target of the friendship
            var friendshipTarget = friendshipOfUsername.Sender.UserName == username
                ? friendshipOfUsername.Receiver
                : friendshipOfUsername.Sender;

            // determine the status of the friendship
            var status = FriendshipStatusDto.None;
            var statusFriendship = friendshipsOfCurrentUser.FirstOrDefault(f =>
                new HashSet<Guid> { f.ReceiverId, f.SenderId }.Contains(friendshipTarget.Id));
            if (statusFriendship != null)
            {
                status = statusFriendship.SenderId == currentUserId
                    ? FriendshipStatusDto.Requested
                    : FriendshipStatusDto.Received;
                if (statusFriendship.Status == FriendshipStatus.Accepted) status = FriendshipStatusDto.Accepted;
            }

            // create the friendship dto
            var friendshipDto = new FriendshipDto
            {
                ModifiedAt = friendshipOfUsername.ModifiedAt,
                Username = friendshipTarget.UserName,
                UserPhoto = friendshipTarget.Photo,
                Status = status
            };

            // add the friendship dto to the result
            if (!isSelf && friendshipOfUsername.Status != FriendshipStatus.Accepted) continue;
            result.ComputeIfAbsent(status, _ => []).Add(friendshipDto);
        }

        return result;
    }

    public async Task<FriendshipStatusDto> Add(string username)
    {
        var (currentUser, user, friendship) = await GetFriendship(username);

        FriendshipStatusDto response;

        if (friendship == null)
        {
            friendship = new Friendship
            {
                Sender = currentUser,
                Receiver = user,
                Status = FriendshipStatus.Pending
            };
            response = FriendshipStatusDto.Requested;
            await context.Friendships.AddAsync(friendship);
        }
        else
        {
            switch (friendship.Status)
            {
                case FriendshipStatus.Accepted:
                    throw new ValidationException("Already friends");
                case FriendshipStatus.Pending:
                    if (friendship.SenderId == currentUser.Id)
                        throw new ValidationException("Friendship request already sent");

                    friendship.Status = FriendshipStatus.Accepted;
                    friendship.ModifiedAt = DateTime.UtcNow;
                    response = FriendshipStatusDto.Accepted;
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        var succeeded = await context.SaveChangesAsync() > 0;
        if (!succeeded) throw new Exception("Problem saving changes");

        return response;
    }

    public async Task<FriendshipStatusDto> Delete(string username)
    {
        var (_, _, friendship) = await GetFriendship(username);

        if (friendship == null) throw new ValidationException("Not friends");

        context.Friendships.Remove(friendship);

        var succeeded = await context.SaveChangesAsync() > 0;
        if (!succeeded) throw new Exception("Problem saving changes");

        return FriendshipStatusDto.None;
    }

    private async Task<(User currentUser, User user, Friendship friendship)> GetFriendship(string username)
    {
        var currentUser = await authUtil.GetCurrentUser();

        if (currentUser.UserName == username) throw new ValidationException("Cannot be in a friendship with yourself");

        var user = await context.Users.Where(u => u.UserName == username).FirstOrDefaultAsync() ??
                   throw new NotFoundException("User not found");

        var friendship = await context.Friendships.Where(f =>
            (f.SenderId == currentUser.Id && f.ReceiverId == user.Id) ||
            (f.SenderId == user.Id && f.ReceiverId == currentUser.Id)).FirstOrDefaultAsync();

        return (currentUser, user, friendship);
    }
}
