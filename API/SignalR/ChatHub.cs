using Application.Contracts;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

public class ChatHub(IAttractionsService attractionsService) : Hub
{
    public async Task AddComment(Guid attractionId, string body)
    {
        var comment = await attractionsService.AddComment(attractionId, body);

        await Clients.Group(attractionId.ToString()).SendAsync("ReceiveComment", comment);
    }

    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        var attractionId = Guid.Parse(httpContext.Request.Query["attractionId"]);
        await Groups.AddToGroupAsync(Context.ConnectionId, attractionId.ToString());
        var comments = await attractionsService.GetComments(attractionId);
        await Clients.Caller.SendAsync("LoadComments", comments);
    }
}
