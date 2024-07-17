namespace API.Extensions;

public static class NullableExtensions
{
    public static TDestination Map<TSource, TDestination>(this TSource? value, Func<TSource, TDestination> mapper,
        TDestination defaultValue = default)
        where TSource : struct
    {
        return value.HasValue ? mapper(value.Value) : defaultValue;
    }
}
