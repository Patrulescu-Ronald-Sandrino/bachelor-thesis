using Application.Contracts.Infrastructure;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Logic;

public class AuthUtil(DataContext context, IUserAccessor userAccessor)
{
    public async Task<User> GetCurrentUser()
    {
        return await context.Users.FirstOrDefaultAsync(x => x.UserName == userAccessor.GetUsername());
    }

    public async Task<Guid> GetCurrentUserId()
    {
        var currentUser = await GetCurrentUser();
        return currentUser.Id;
    }
}
