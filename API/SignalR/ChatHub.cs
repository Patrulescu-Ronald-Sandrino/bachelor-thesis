using Application.Contracts;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

public class ChatHub(IAttractionsService attractionsService) : Hub
{
    public async Task SendComment(Comment commentDto)
    {
        var comment = await attractionsService.AddComment(commentDto.AttractionId, commentDto.Body);

        await Clients.Group(commentDto.AttractionId.ToString()).SendAsync("ReceiveComment", comment);
    }

    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        var attractionId = Guid.Parse(httpContext.Request.Query["attractionId"]);
        await Groups.AddToGroupAsync(Context.ConnectionId, attractionId.ToString());
        var comments = await attractionsService.GetComments(attractionId);
        await Clients.Caller.SendAsync("LoadComments", comments);
    }

    public class Comment
    {
        public Guid AttractionId { get; set; }
        public string Body { get; set; }
    }
}
