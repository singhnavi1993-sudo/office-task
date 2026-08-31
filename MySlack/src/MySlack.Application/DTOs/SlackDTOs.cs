using System;
using System.Collections.Generic;
using MySlack.Domain.Enums;

namespace MySlack.Application.DTOs;

public record LoginRequestDto(string Email, string Password);
public record RegisterRequestDto(string Email, string Password, string DisplayName, string Username);
public record AuthResponseDto(string Token, UserDto User);

public record UserDto(Guid Id, string Username, string Email, string DisplayName, string AvatarUrl, string CustomStatus, UserStatus Status);
public record WorkspaceDto(Guid Id, string Name, string Slug, string IconUrl, Guid OwnerId, List<ChannelDto> Channels);
public record ChannelDto(Guid Id, Guid WorkspaceId, string Name, string Topic, ChannelType Type, bool IsArchived, int MemberCount);
public record MessageDto(
    Guid Id,
    Guid ChannelId,
    Guid UserId,
    string UserName,
    string UserAvatar,
    string Content,
    Guid? ParentMessageId,
    int ReplyCount,
    bool IsEdited,
    DateTime CreatedAt,
    List<ReactionDto> Reactions,
    List<AttachmentDto> Attachments
);

public record CreateMessageDto(Guid ChannelId, string Content, Guid? ParentMessageId);
public record AddReactionDto(Guid MessageId, string Emoji);
public record ReactionDto(Guid Id, string Emoji, Guid UserId, string UserName);
public record AttachmentDto(Guid Id, string FileName, string FileUrl, string ContentType, long FileSizeBytes);
