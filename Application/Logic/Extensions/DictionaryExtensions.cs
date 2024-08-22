namespace Application.Logic.Extensions;

public static class DictionaryExtensions
{
    public static TValue ComputeIfAbsent<TKey, TValue>(this Dictionary<TKey, TValue> @this, TKey key,
        Func<TKey, TValue> generator)
    {
        if (@this.TryGetValue(key, out var value))
        {
            return value;
        }

        var generated = generator(key);
        @this.Add(key, generated);
        return generated;
    }
}
