namespace Application.Logic.Extensions;

public static class PredicateExtensions
{
    public static Predicate<T> Or<T>(this Predicate<T> @this, Predicate<T> other)
    {
        return o => @this.Invoke(o) || other.Invoke(o);
    }
}
