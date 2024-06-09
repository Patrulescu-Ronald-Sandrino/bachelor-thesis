using Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public static class DbExtensions
{
    public static async ValueTask<TEntity> FindAsyncOrThrow<TEntity>(this DbSet<TEntity> dbSet, params object[] id)
        where TEntity : class
    {
        var value = await dbSet.FindAsync(id);
        if (value == null) throw new NotFoundException();
        return value;
    }
}