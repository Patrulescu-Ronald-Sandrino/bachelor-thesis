using Application.Contracts;
using Application.Exceptions;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Logic;

public class AdminService(DataContext context) : IAdminService
{
    public async Task DeleteUser(string username)
    {
        var user = await context.Users.Where(u => u.UserName == username).FirstOrDefaultAsync() ??
                   throw new NotFoundException();

        context.Remove(user);

        var succeeded = await context.SaveChangesAsync() > 0;
        if (!succeeded) throw new Exception("Problem deleting user");
    }
}
