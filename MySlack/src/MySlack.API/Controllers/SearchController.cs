using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySlack.Application.DTOs;
using MySlack.Application.Interfaces;

namespace MySlack.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SearchController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public SearchController(IApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Search messages and channels with filters (in:#channel, from:@user)
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> Search([FromQuery] string q, [FromQuery] Guid? channelId, [FromQuery] Guid? userId)
    {
        if (string.IsNullOrWhiteSpace(q)) return Ok(new { messages = new object[0], channels = new object[0] });

        var queryTerm = q.Trim().ToLower();

        // Search Channels
        var matchingChannels = await _context.Channels
            .Where(c => c.Name.ToLower().Contains(queryTerm) || c.Topic.ToLower().Contains(queryTerm))
            .Take(10)
            .Select(c => new { c.Id, c.Name, c.Topic, c.Type })
            .ToListAsync();

        // Search Messages
        var messageQuery = _context.Messages
            .Include(m => m.User)
            .Include(m => m.Reactions)
            .Include(m => m.Attachments)
            .Where(m => m.Content.ToLower().Contains(queryTerm));

        if (channelId.HasValue)
            messageQuery = messageQuery.Where(m => m.ChannelId == channelId.Value);

        if (userId.HasValue)
            messageQuery = messageQuery.Where(m => m.UserId == userId.Value);

        var matchingMessages = await messageQuery
            .OrderByDescending(m => m.CreatedAt)
            .Take(20)
            .Select(m => new MessageDto(
                m.Id, m.ChannelId, m.UserId, m.User != null ? m.User.DisplayName : "Unknown",
                m.User != null ? m.User.AvatarUrl : "", m.Content, m.ParentMessageId,
                m.Replies.Count, m.IsEdited, m.CreatedAt, new System.Collections.Generic.List<ReactionDto>(), new System.Collections.Generic.List<AttachmentDto>()
            ))
            .ToListAsync();

        return Ok(new { channels = matchingChannels, messages = matchingMessages });
    }
}
