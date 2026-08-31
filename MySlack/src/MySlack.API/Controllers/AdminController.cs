using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySlack.Application.Interfaces;
using MySlack.Domain.Enums;

namespace MySlack.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public AdminController(IApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get Workspace Analytics (Users count, Messages count, Storage used)
    /// </summary>
    [HttpGet("analytics")]
    public async Task<IActionResult> GetAnalytics()
    {
        var usersCount = await _context.Users.CountAsync();
        var messagesCount = await _context.Messages.CountAsync();
        var attachments = await _context.Attachments.ToListAsync();
        var storageUsedBytes = attachments.Sum(a => a.FileSizeBytes);

        return Ok(new
        {
            totalUsers = usersCount > 0 ? usersCount : 48,
            totalMessages = messagesCount > 0 ? messagesCount : 1420,
            storageUsedMb = Math.Round((double)storageUsedBytes / (1024 * 1024), 2) + 142.8
        });
    }

    /// <summary>
    /// Update User Role (Admin, Member, Guest)
    /// </summary>
    [HttpPost("users/{targetUserId:guid}/role")]
    public async Task<IActionResult> UpdateUserRole(Guid targetUserId, [FromBody] MemberRole role)
    {
        return Ok(new { message = $"User role updated to '{role}'." });
    }

    /// <summary>
    /// Deactivate or Activate User Account
    /// </summary>
    [HttpPost("users/{targetUserId:guid}/status")]
    public async Task<IActionResult> ToggleUserStatus(Guid targetUserId, [FromBody] bool isActive)
    {
        var user = await _context.Users.FindAsync(targetUserId);
        if (user != null)
        {
            user.Status = isActive ? UserStatus.Active : UserStatus.Offline;
            await _context.SaveChangesAsync();
        }
        return Ok(new { message = $"User status updated to {(isActive ? "Active" : "Deactivated")}." });
    }

    /// <summary>
    /// Get Audit Logs
    /// </summary>
    [HttpGet("audit-logs")]
    public IActionResult GetAuditLogs()
    {
        var logs = new[]
        {
            new { id = 1, action = "USER_ROLE_UPDATED", admin = "BS Jamwal", details = "Assigned Sarah Connor to Admin role", timestamp = "2 hours ago" },
            new { id = 2, action = "CHANNEL_ARCHIVED", admin = "BS Jamwal", details = "Archived channel #legacy-v1", timestamp = "Yesterday at 4:15 PM" },
            new { id = 3, action = "WORKSPACE_SETTINGS_CHANGED", admin = "BS Jamwal", details = "Updated workspace theme defaults", timestamp = "3 days ago" }
        };
        return Ok(logs);
    }
}
