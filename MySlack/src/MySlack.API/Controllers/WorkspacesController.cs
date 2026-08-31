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
public class WorkspacesController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public WorkspacesController(IApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get all workspaces for current user
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetUserWorkspaces([FromHeader(Name = "X-User-Id")] Guid userId)
    {
        var workspaces = await _context.Workspaces
            .Include(w => w.Channels)
            .OrderByDescending(w => w.CreatedAt)
            .ToListAsync();

        var result = workspaces.Select(w => new WorkspaceDto(
            w.Id,
            w.Name,
            w.Slug,
            w.IconUrl,
            w.OwnerId,
            w.Channels.Select(c => new ChannelDto(c.Id, c.WorkspaceId, c.Name, c.Topic, c.Type, c.IsArchived, c.Members.Count)).ToList()
        )).ToList();

        return Ok(result);
    }

    /// <summary>
    /// Create a new Workspace and default #general channel
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateWorkspace([FromBody] string name, [FromHeader(Name = "X-User-Id")] Guid userId)
    {
        if (string.IsNullOrWhiteSpace(name))
            return BadRequest(new { message = "Workspace name cannot be empty." });

        var workspace = new Workspace
        {
            Id = Guid.NewGuid(),
            Name = name,
            Slug = name.ToLower().Replace(" ", "-"),
            IconUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=128&q=80",
            OwnerId = userId,
            CreatedAt = DateTime.UtcNow
        };

        var defaultChannel = new Channel
        {
            Id = Guid.NewGuid(),
            WorkspaceId = workspace.Id,
            Name = "general",
            Topic = "Company-wide announcements and team discussions",
            Type = ChannelType.Public,
            CreatedAt = DateTime.UtcNow
        };

        _context.Workspaces.Add(workspace);
        _context.Channels.Add(defaultChannel);
        await _context.SaveChangesAsync();

        return Ok(workspace);
    }

    /// <summary>
    /// Join workspace via slug/invite code
    /// </summary>
    [HttpPost("join/{slug}")]
    public async Task<IActionResult> JoinWorkspace(string slug, [FromHeader(Name = "X-User-Id")] Guid userId)
    {
        var workspace = await _context.Workspaces.FirstOrDefaultAsync(w => w.Slug.ToLower() == slug.ToLower());
        if (workspace == null)
            return NotFound(new { message = "Workspace not found." });

        return Ok(new { message = $"Successfully joined workspace '{workspace.Name}'." });
    }
}
