using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySlack.Application.DTOs;
using MySlack.Application.Interfaces;
using MySlack.Domain.Entities;
using MySlack.Domain.Enums;

namespace MySlack.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChannelsController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public ChannelsController(IApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get all channels for a workspace
    /// </summary>
    [HttpGet("workspace/{workspaceId:guid}")]
    public async Task<IActionResult> GetWorkspaceChannels(Guid workspaceId)
    {
        var channels = await _context.Channels
            .Include(c => c.Members)
            .Where(c => c.WorkspaceId == workspaceId && !c.IsArchived)
            .ToListAsync();

        var result = channels.Select(c => new ChannelDto(
            c.Id, c.WorkspaceId, c.Name, c.Topic, c.Type, c.IsArchived, c.Members.Count
        )).ToList();

        return Ok(result);
    }

    /// <summary>
    /// Create a new Public or Private channel
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateChannel([FromBody] CreateChannelRequestDto dto, [FromHeader(Name = "X-User-Id")] Guid userId)
    {
        var channel = new Channel
        {
            Id = Guid.NewGuid(),
            WorkspaceId = dto.WorkspaceId,
            Name = dto.Name.ToLower().Replace(" ", "-"),
            Topic = dto.Topic ?? "",
            Type = dto.IsPrivate ? ChannelType.Private : ChannelType.Public,
            CreatedAt = DateTime.UtcNow
        };

        var member = new ChannelMember
        {
            ChannelId = channel.Id,
            UserId = userId,
            Role = MemberRole.Admin,
            JoinedAt = DateTime.UtcNow
        };

        _context.Channels.Add(channel);
        _context.ChannelMembers.Add(member);
        await _context.SaveChangesAsync();

        return Ok(new ChannelDto(channel.Id, channel.WorkspaceId, channel.Name, channel.Topic, channel.Type, channel.IsArchived, 1));
    }

    /// <summary>
    /// Archive a channel
    /// </summary>
    [HttpPost("{channelId:guid}/archive")]
    public async Task<IActionResult> ArchiveChannel(Guid channelId)
    {
        var channel = await _context.Channels.FindAsync(channelId);
        if (channel == null) return NotFound();

        channel.IsArchived = true;
        await _context.SaveChangesAsync();

        return Ok(new { message = $"Channel #{channel.Name} archived successfully." });
    }

    /// <summary>
    /// Add member to channel
    /// </summary>
    [HttpPost("{channelId:guid}/members/{targetUserId:guid}")]
    public async Task<IActionResult> AddMember(Guid channelId, Guid targetUserId)
    {
        var member = new ChannelMember
        {
            ChannelId = channelId,
            UserId = targetUserId,
            Role = MemberRole.Member,
            JoinedAt = DateTime.UtcNow
        };

        _context.ChannelMembers.Add(member);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Member added to channel." });
    }
}

public record CreateChannelRequestDto(Guid WorkspaceId, string Name, string? Topic, bool IsPrivate);
