using Domain.Exceptions;

namespace Application.Utils;

public class Validator
{
    private readonly Dictionary<string, string[]> _errors = new();

    public Validator Add(bool condition, string error, string[] details)
    {
        if (condition) _errors.Add(error, details);
        return this;
    }

    public void Run()
    {
        if (_errors.Count > 0) throw new ValidationException(_errors);
    }
}
