namespace Domain.Exceptions;

public class ValidationException(Dictionary<string, string[]> errors)
    : Exception("One or more validation errors occurred.")
{
    public Dictionary<string, string[]> Errors { get; private set; } = errors;
}