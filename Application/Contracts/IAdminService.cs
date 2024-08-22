namespace Application.Contracts;

public interface IAdminService
{
    Task DeleteUser(string username);
}
