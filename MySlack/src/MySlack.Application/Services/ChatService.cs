using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MySlack.Application.DTOs;
using MySlack.Application.Interfaces;
using MySlack.Domain.Entities;
using MySlack.Domain.Enums;

namespace MySlack.Application.Services;

public class ChatService
{
    private readonly IApplicationDbContext _context;
    private readonly ISignalRService _signalRService;

    public ChatService(IApplicationDbContext context, ISignalRService signalRService)
    {
        _context = context;
        _signalRService = signalRService;
    }

    public async Task<List<MessageDto>> GetChannelMessagesAsync(Guid channelId, Guid? parentMessageId = null)
    {
        var messages = await _context.Messages
            .Include(m => m.User)
            .Include(m => m.Reactions).ThenInclude(r => r.User)
            .Include(m => m.Attachments)
            .Include(m => m.Replies)
            .Where(m => m.ChannelId == channelId && m.ParentMessageId == parentMessageId)
            .OrderBy(m => m.CreatedAt)
            .ToListAsync();

        return messages.Select(m => new MessageDto(
            m.Id,
            m.ChannelId,
            m.UserId,
            m.User?.DisplayName ?? "Unknown",
            m.User?.AvatarUrl ?? "",
            m.Content,
            m.ParentMessageId,
            m.Replies.Count,
            m.IsEdited,
            m.CreatedAt,
            m.Reactions.Select(r => new ReactionDto(r.Id, r.Emoji, r.UserId, r.User?.DisplayName ?? "")).ToList(),
            m.Attachments.Select(a => new AttachmentDto(a.Id, a.FileName, a.FileUrl, a.ContentType, a.FileSizeBytes)).ToList()
        )).ToList();
    }

    public async Task<MessageDto> PostMessageAsync(Guid userId, CreateMessageDto dto)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) throw new InvalidOperationException("User not found");

        var message = new Message
        {
            ChannelId = dto.ChannelId,
            UserId = userId,
            Content = dto.Content,
            ParentMessageId = dto.ParentMessageId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        var messageDto = new MessageDto(
            message.Id,
            message.ChannelId,
            message.UserId,
            user.DisplayName,
            user.AvatarUrl,
            message.Content,
            message.ParentMessageId,
            0,
            false,
            message.CreatedAt,
            new List<ReactionDto>(),
            new List<AttachmentDto>()
        );

        await _signalRService.BroadcastMessageAsync(dto.ChannelId, messageDto);
        return messageDto;
    }
}
