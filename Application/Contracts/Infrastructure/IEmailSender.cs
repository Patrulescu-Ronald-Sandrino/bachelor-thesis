namespace Application.Contracts.Infrastructure;

public interface IEmailSender
{
    Task SendEmailAsync(string toEmail, string subject, string html);
    void SendDevEmail(string subject, string html);
}
