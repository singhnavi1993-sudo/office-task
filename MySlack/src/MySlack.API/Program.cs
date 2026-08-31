using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MySlack.API.Hubs;
using MySlack.Application.Interfaces;
using MySlack.Application.Services;
using MySlack.Infrastructure.Identity;
using MySlack.Infrastructure.Persistence;
using MySlack.Infrastructure.Storage;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? "Server=(localdb)\\mssqllocaldb;Database=MySlackDb;Trusted_Connection=True;MultipleActiveResultSets=true"));

builder.Services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());
builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
builder.Services.AddScoped<ChatService>();
builder.Services.AddScoped<MentionParsingService>();

builder.Services.AddSignalR();

// Allow CORS for local network access (Wi-Fi / LAN Mode & Cloud)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalNetwork", policy =>
    {
        policy.SetIsOriginAllowed(_ => true) // Allows any local IP range (192.168.x.x, 10.x.x.x, etc.)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowLocalNetwork");
app.UseStaticFiles(); // Serve local file uploads from wwwroot/uploads for Wi-Fi users

app.UseAuthorization();

app.MapControllers();
app.MapHub<ChatHub>("/hubs/chat");

// Bind to 0.0.0.0:5000 so external Wi-Fi devices can connect to host PC
app.Run("http://0.0.0.0:5000");
