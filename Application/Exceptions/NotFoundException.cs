namespace Application.Exceptions;

public class NotFoundException(string message = "Not found") : Exception(message);
