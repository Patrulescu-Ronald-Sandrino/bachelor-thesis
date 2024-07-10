using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Pagination;

public class PageParams
{
    [Range(1, int.MaxValue)] public int PageNumber { get; set; } = 1;

    [AllowedValues(6, 12, 24, 48, 96, 192)]
    public int PageSize { get; set; } = 6;
}
