using Microsoft.Extensions.Configuration;

namespace Utils;

public static class ConfigurationManagerExtensions
{
    public static string GetOrThrow(this ConfigurationManager configuration, string key)
    {
        var value = configuration[key];
        if (value == null)
        {
            throw new InvalidOperationException($"Configuration value for key '{key}' not found.");
        }

        return value;
    }
}