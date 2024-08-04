namespace Application.Exceptions;

public class ValidationException(string message, Dictionary<string, string[]> errors = null) : Exception(message)
{
    public Dictionary<string, string[]> Errors { get; private set; } = errors ?? [];
}
