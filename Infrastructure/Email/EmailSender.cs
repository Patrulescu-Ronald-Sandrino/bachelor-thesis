using System.Net;
using System.Net.Mail;
using Application.Contracts.Infrastructure;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Email;

public class EmailSender(IConfiguration config) : IEmailSender
{
    private readonly SmtpClient _smtpClient = new()
    {
        Host = config["mail-server"],
        Port = Convert.ToInt32(config["mail-port"]),
        EnableSsl = true,
        DeliveryMethod = SmtpDeliveryMethod.Network,
        UseDefaultCredentials = false,
        Credentials = new NetworkCredential(config["mail-email"], config["mail-password"]),
    };

    public async Task SendEmailAsync(string toEmail, string subject, string html)
    {
        var message = new MailMessage
        {
            From = new MailAddress(config["mail-email"]),
            To = { toEmail },
            Subject = subject,
            Body = html,
            IsBodyHtml = true,
        };

        await _smtpClient.SendMailAsync(message);
    }
}
