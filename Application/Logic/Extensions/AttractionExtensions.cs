using System.Linq.Expressions;
using System.Text.RegularExpressions;
using Application.DTOs.Attraction.Query;
using Application.DTOs.Query;
using Domain.Entities;

namespace Application.Logic.Extensions;

public static class AttractionExtensions
{
    private static readonly Dictionary<SearchField, Func<Attraction, string>> Getters = new()
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

        return query
            .Where(a => getterList.Any(g => Regex.Match(searchValue, g(a)).Success));
    }

    public static IQueryable<Attraction> Filter(this IQueryable<Attraction> query, string[] types)
    {
        if (types == null || types.Length == 0) return query;

        return query.Where(a => types.Contains(a.AttractionType.Name));
    }
}
