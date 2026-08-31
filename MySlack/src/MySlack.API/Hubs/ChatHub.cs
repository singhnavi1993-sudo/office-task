using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using MySlack.Application.DTOs;
using MySlack.Application.Services;

namespace MySlack.API.Hubs;

public class ChatHub : Hub
{
    private static readonly ConcurrentDictionary<string, string> OnlineUsers = new();
    private readonly ChatService _chatService;

    public ChatHub(ChatService chatService)
    {
        _chatService = chatService;
    }

    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        var userId = httpContext?.Request.Query["userId"].ToString() ?? Context.ConnectionId;

        OnlineUsers[Context.ConnectionId] = userId;
        await Clients.All.SendAsync("UserPresenceChanged", new { userId, status = "active", connectionId = Context.ConnectionId });
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if (OnlineUsers.TryRemove(Context.ConnectionId, out var userId))
        {
            await Clients.All.SendAsync("UserPresenceChanged", new { userId, status = "offline", connectionId = Context.ConnectionId });
        }
        await base.OnDisconnectedAsync(exception);
    }

    public async Task JoinChannel(string channelId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, channelId);
    }

    public async Task LeaveChannel(string channelId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, channelId);
    }

    public async Task SendMessage(Guid channelId, Guid userId, string content, Guid? parentMessageId = null)
    {
        var messageDto = await _chatService.PostMessageAsync(userId, new CreateMessageDto(channelId, content, parentMessageId));
        await Clients.Group(channelId.ToString()).SendAsync("ReceiveMessage", messageDto);
    }

    public async Task EditMessage(Guid messageId, Guid channelId, string newContent)
    {
        await Clients.Group(channelId.ToString()).SendAsync("MessageEdited", new { messageId, newContent, isEdited = true });
    }

    public async Task DeleteMessage(Guid messageId, Guid channelId)
    {
        await Clients.Group(channelId.ToString()).SendAsync("MessageDeleted", new { messageId });
    }

    public async Task SendTyping(string channelId, string userId, string userName)
    {
        await Clients.OthersInGroup(channelId).SendAsync("UserTyping", new { channelId, userId, userName });
    }
}
