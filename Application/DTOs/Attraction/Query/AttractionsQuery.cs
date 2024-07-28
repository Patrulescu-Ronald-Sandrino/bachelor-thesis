using Application.DTOs.Pagination;
using Application.DTOs.Query;

namespace Application.DTOs.Attraction.Query;

public class AttractionsQuery : PageParams
{
    public bool MadeByMe { get; set; }
    public SortField SortField { get; set; } = SortField.Name;
    public SortOrder SortOrder { get; set; } = SortOrder.Ascending;
    public SearchField SearchField { get; set; } = SearchField.All;
    public string SearchValue { get; set; }
    public string[] Types { get; set; }
}
