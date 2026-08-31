using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MySlack.Domain.Entities;

namespace MySlack.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Workspace> Workspaces { get; }
    DbSet<Channel> Channels { get; }
    DbSet<ChannelMember> ChannelMembers { get; }
    DbSet<Message> Messages { get; }
    DbSet<Attachment> Attachments { get; }
    DbSet<Reaction> Reactions { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}

public interface IJwtTokenGenerator
{
    string GenerateToken(User user);
}

public interface ISignalRService
{
    Task BroadcastMessageAsync(Guid channelId, object messageDto);
    Task BroadcastTypingAsync(Guid channelId, Guid userId, string userName);
    Task BroadcastUserStatusAsync(Guid userId, string status);
}
