using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MySlack.Application.DTOs;
using MySlack.Application.Services;

namespace MySlack.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MessagesController : ControllerBase
{
    private readonly ChatService _chatService;

    public MessagesController(ChatService chatService)
    {
        _chatService = chatService;
    }

    [HttpGet("channel/{channelId:guid}")]
    public async Task<IActionResult> GetChannelMessages(Guid channelId, [FromQuery] Guid? parentMessageId)
    {
        var messages = await _chatService.GetChannelMessagesAsync(channelId, parentMessageId);
        return Ok(messages);
    }

    [HttpPost]
    public async Task<IActionResult> PostMessage([FromBody] CreateMessageDto dto, [FromHeader(Name = "X-User-Id")] Guid userId)
    {
        var message = await _chatService.PostMessageAsync(userId, dto);
        return Ok(message);
    }
}
