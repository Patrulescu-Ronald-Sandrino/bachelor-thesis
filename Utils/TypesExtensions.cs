using System.Text.RegularExpressions;

namespace Utils;

public static partial class TypesExtensions
{
    public static Guid OfChar(this Guid guid, char c) =>
        Guid.Parse(NotDashRegex().Replace(guid.ToString(), c.ToString()));

    [GeneratedRegex("[^-]")]
    private static partial Regex NotDashRegex();
}
