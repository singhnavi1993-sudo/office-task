using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using MySlack.Application.Interfaces;

namespace MySlack.Application.Services;

public class MentionParsingService
{
    private readonly ISignalRService _signalRService;

    public MentionParsingService(ISignalRService signalRService)
    {
        _signalRService = signalRService;
    }

    public async Task ParseAndNotifyMentionsAsync(Guid channelId, Guid senderId, string content)
    {
        if (string.IsNullOrWhiteSpace(content)) return;

        var mentions = new List<string>();

        // Regex to detect @username, @channel, @here
        var matches = Regex.Matches(content, @"@(\w+)");
        foreach (Match match in matches)
        {
            mentions.Add(match.Groups[1].Value);
        }

        if (mentions.Contains("here") || mentions.Contains("channel"))
        {
            await _signalRService.BroadcastMessageAsync(channelId, new
            {
                type = "CHANNEL_MENTION",
                channelId,
                senderId,
                message = "Channel mention triggered (@channel/@here)"
            });
        }
        else if (mentions.Count > 0)
        {
            await _signalRService.BroadcastMessageAsync(channelId, new
            {
                type = "USER_MENTIONS",
                channelId,
                senderId,
                mentionedUsernames = mentions
            });
        }
    }
}
