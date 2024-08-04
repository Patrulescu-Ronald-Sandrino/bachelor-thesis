using Application.Contracts.Infrastructure;
using Domain.Entities;
using Persistence;

namespace Application.Logic;

public class UserService(DataContext context, IUserAccessor userAccessor)
{
    public User GetCurrentUser()
    {
        return context.Users.FirstOrDefault(x => x.UserName == userAccessor.GetUsername());
    }
}
