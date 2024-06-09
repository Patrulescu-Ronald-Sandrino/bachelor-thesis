using Application.Contracts.Infrastructure;
using Domain.Entities;
using Persistence;

namespace Application.Utils;

public class AuthUtils(DataContext context, IUserAccessor userAccessor)
{
    public User GetCurrentUser()
    {
        return context.Users.FirstOrDefault(x => x.UserName == userAccessor.GetUsername());
    }
}