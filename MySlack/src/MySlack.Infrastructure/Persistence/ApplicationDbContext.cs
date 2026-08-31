using Microsoft.EntityFrameworkCore;
using MySlack.Application.Interfaces;
using MySlack.Domain.Entities;

namespace MySlack.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Workspace> Workspaces => Set<Workspace>();
    public DbSet<Channel> Channels => Set<Channel>();
    public DbSet<ChannelMember> ChannelMembers => Set<ChannelMember>();
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<Attachment> Attachments => Set<Attachment>();
    public DbSet<Reaction> Reactions => Set<Reaction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ChannelMember>()
            .HasKey(cm => new { cm.ChannelId, cm.UserId });

        modelBuilder.Entity<ChannelMember>()
            .HasOne(cm => cm.Channel)
            .WithMany(c => c.Members)
            .HasForeignKey(cm => cm.ChannelId);

        modelBuilder.Entity<ChannelMember>()
            .HasOne(cm => cm.User)
            .WithMany(u => u.ChannelMemberships)
            .HasForeignKey(cm => cm.UserId);

        modelBuilder.Entity<Message>()
            .HasOne(m => m.ParentMessage)
            .WithMany(m => m.Replies)
            .HasForeignKey(m => m.ParentMessageId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
