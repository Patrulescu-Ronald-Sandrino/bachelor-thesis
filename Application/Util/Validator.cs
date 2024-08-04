using Application.Exceptions;

namespace Application.Util;

public class Validator
{
    private readonly Dictionary<string, string[]> _errors = new();

    public Validator Add(bool condition, string error, string[] details)
    {
        if (condition)
            _errors[error] = _errors.TryGetValue(error, out var value) ? value.Concat(details).ToArray() : details;

        return this;
    }

    public Validator Add(string error, string details)
    {
        return Add(true, error, [details]);
    }

    public void Run()
    {
        if (_errors.Count > 0) throw new ValidationException("One or more validation errors occurred.", _errors);
    }

    public static void Run(bool condition, string error, string[] details)
    {
        new Validator().Add(condition, error, details).Run();
    }
}
