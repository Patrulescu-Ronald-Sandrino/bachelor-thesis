namespace Persistence.Util;

public static class EnumUtil
{
    public static IEnumerable<T> GetValues<T>() where T : Enum
    {
        return (T[])Enum.GetValues(typeof(T));
    }
}
