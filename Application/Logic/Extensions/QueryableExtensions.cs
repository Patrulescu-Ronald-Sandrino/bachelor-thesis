using System.Collections.Frozen;
using Microsoft.EntityFrameworkCore;

namespace Application.Logic.Extensions;

public static class QueryableExtensions
{
    public static async Task<FrozenDictionary<TKey, TElement>> ToFrozenDictionaryAsync<TSource, TKey, TElement>(
        this IQueryable<TSource> source,
        Func<TSource, TKey> keySelector,
        Func<TSource, TElement> elementSelector,
        CancellationToken cancellationToken = default)
    {
        return (await source.ToDictionaryAsync(keySelector, elementSelector, cancellationToken)).ToFrozenDictionary();
    }
}
