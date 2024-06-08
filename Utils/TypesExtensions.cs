namespace Utils;

public static class TypesExtensions
{
    public static string Repeat(this string s, int n) => string.Concat(Enumerable.Repeat(s, n));
}