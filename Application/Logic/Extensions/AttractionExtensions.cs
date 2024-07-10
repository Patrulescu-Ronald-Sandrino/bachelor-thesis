using System.Linq.Expressions;
using Application.DTOs.Attraction.Query;
using Application.DTOs.Query;
using Domain.Entities;

namespace Application.Logic.Extensions;

public static class AttractionExtensions
{
    private static readonly Dictionary<SearchField, Expression<Func<Attraction, string>>> Getters = new()
    {
        [SearchField.Name] = a => a.Name,
        [SearchField.TypeName] = a => a.AttractionType.Name,
        [SearchField.CountryName] = a => a.Country.Name,
        [SearchField.CityName] = a => a.City,
        [SearchField.Address] = a => a.Address,
        [SearchField.Description] = a => a.Description,
        [SearchField.Website] = a => a.Website
    };

    public static IQueryable<Attraction> Sort(this IQueryable<Attraction> query, SortField sortField,
        SortOrder sortOrder)
    {
        Expression<Func<Attraction, string>> keySelector = sortField switch
        {
            SortField.TypeName => a => a.AttractionType.Name,
            SortField.CountryName => a => a.Country.Name,
            SortField.CityName => a => a.City,
            _ => a => a.Name
        };

        return sortOrder == SortOrder.Descending ? query.OrderByDescending(keySelector) : query.OrderBy(keySelector);
    }

    public static IQueryable<Attraction> Search(this IQueryable<Attraction> query, SearchField searchField,
        string searchValue)
    {
        if (string.IsNullOrEmpty(searchValue)) return query;

        var searchFieldIsInGetters = Getters.TryGetValue(searchField, out var getter);
        var getterList = searchFieldIsInGetters ? [getter] : Getters.Values.ToArray();

        var parameter = Expression.Parameter(typeof(Attraction), "a");
        Expression predicateBody = Expression.Constant(false);

        foreach (var getterExpr in getterList)
        {
            var memberExpr = Expression.Invoke(getterExpr, parameter);
            var searchValueExpr = Expression.Constant(searchValue);
            var containsMethod = typeof(string).GetMethod(nameof(string.Contains), [typeof(string)]);
            var containsExpr = Expression.Call(memberExpr, containsMethod, searchValueExpr);
            predicateBody = Expression.OrElse(predicateBody, containsExpr);
        }

        var predicate = Expression.Lambda<Func<Attraction, bool>>(predicateBody, parameter);
        return query.Where(predicate);
    }

    public static IQueryable<Attraction> Filter(this IQueryable<Attraction> query, string[] types)
    {
        if (types == null || types.Length == 0 || types.All(string.IsNullOrWhiteSpace)) return query;

        return query.Where(a => types.Contains(a.AttractionType.Name));
    }
}
