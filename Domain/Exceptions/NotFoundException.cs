namespace Domain.Exceptions;

public class NotFoundException(object identifier) : Exception("Not found")
{
}