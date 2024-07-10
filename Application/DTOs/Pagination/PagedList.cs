using Microsoft.EntityFrameworkCore;

namespace Application.DTOs.Pagination;

public class PagedList<T> : List<T>
{
    private PagedList(List<T> items, int count, int pageNumber, int pageSize)
    {
        PageData = new PageData
        {
            TotalCount = count,
            PageSize = pageSize,
            CurrentPage = pageNumber,
            TotalPages = (int)Math.Ceiling(count / (double)pageSize)
        };
        AddRange(items);
    }

    public PageData PageData { get; set; }

    public static async Task<PagedList<T>> ToPagedList(IQueryable<T> query, int pageNumber, int pageSize)
    {
        var count = await query.CountAsync();
        var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
        return new PagedList<T>(items, count, pageNumber, pageSize);
    }
}
