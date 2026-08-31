using System;
using System.Security.Cryptography;
using System.Text;
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
public class AuthController : ControllerBase
{
    private readonly IApplicationDbContext _context;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public AuthController(IApplicationDbContext context, IJwtTokenGenerator jwtTokenGenerator)
    {
        _context = context;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    /// <summary>
    /// Register a new user account with hashed password
    /// </summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) || !dto.Email.Contains("@"))
            return BadRequest(new { message = "Invalid email address format." });

        if (await _context.Users.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower()))
            return BadRequest(new { message = "Email is already registered." });

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = dto.Email,
            Username = dto.Username ?? dto.DisplayName.ToLower().Replace(" ", "_"),
            DisplayName = dto.DisplayName,
            PasswordHash = HashPassword(dto.Password),
            AvatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80",
            Status = UserStatus.Active,
            CustomStatus = "🎉 Joined MySlack Workspace",
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = _jwtTokenGenerator.GenerateToken(user);
        var userDto = new UserDto(user.Id, user.Username, user.Email, user.DisplayName, user.AvatarUrl, user.CustomStatus, user.Status);

        return Ok(new AuthResponseDto(token, userDto));
    }

    /// <summary>
    /// Authenticate user and issue JWT Bearer Token
    /// </summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());
        if (user == null || !VerifyPassword(dto.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid email or password." });

        var token = _jwtTokenGenerator.GenerateToken(user);
        var userDto = new UserDto(user.Id, user.Username, user.Email, user.DisplayName, user.AvatarUrl, user.CustomStatus, user.Status);

        return Ok(new AuthResponseDto(token, userDto));
    }

    /// <summary>
    /// Refresh JWT token endpoint
    /// </summary>
    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromHeader(Name = "X-User-Id")] Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return Unauthorized();

        var token = _jwtTokenGenerator.GenerateToken(user);
        var userDto = new UserDto(user.Id, user.Username, user.Email, user.DisplayName, user.AvatarUrl, user.CustomStatus, user.Status);

        return Ok(new AuthResponseDto(token, userDto));
    }

    /// <summary>
    /// Get current logged-in user profile details
    /// </summary>
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile([FromHeader(Name = "X-User-Id")] Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound();

        return Ok(new UserDto(user.Id, user.Username, user.Email, user.DisplayName, user.AvatarUrl, user.CustomStatus, user.Status));
    }

    private static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(bytes);
    }

    private static bool VerifyPassword(string password, string storedHash)
    {
        return HashPassword(password) == storedHash;
    }
}
