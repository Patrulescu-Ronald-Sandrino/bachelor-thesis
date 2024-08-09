using System.Net;
using System.Net.Mail;
using Application.Contracts.Infrastructure;
using Application.Extensions;
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
            Subject = subject + $" [{DateTime.UtcNow:yyyy-MM-dd HH:mm:ss.fff zzz}]",
            Body = html,
            IsBodyHtml = true,
        };

        await _smtpClient.SendMailAsync(message);
    }

    public void SendDevEmail(string subject, string html)
    {
        var sendDevEmail = async delegate(ushort retry)
        {
            var retryInfo = retry != 0 ? $" [retry {retry}]" : "";
            await SendEmailAsync(config["mail-dev"], subject + retryInfo, html);
        };
        _ = sendDevEmail.InvokeWithRetries(3, TimeSpan.FromSeconds(2), 1.5);
    }
}
