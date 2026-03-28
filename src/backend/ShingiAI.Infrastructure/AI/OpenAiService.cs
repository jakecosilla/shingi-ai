using Microsoft.Extensions.Options;
using OpenAI;
using OpenAI.Chat;
using ShingiAI.Application.Interfaces;

namespace ShingiAI.Infrastructure.AI;

public class OpenAiService : IAiService
{
    private readonly OpenAIClient _client;
    private readonly OpenAiOptions _options;

    public OpenAiService(IOptions<OpenAiOptions> options)
    {
        _options = options.Value;
        _client = new OpenAIClient(_options.ApiKey);
    }

    public async Task<string> AskAsync(string prompt, CancellationToken cancellationToken)
    {
        var chatClient = _client.GetChatClient("gpt-4o-mini");

        var response = await chatClient.CompleteChatAsync(
            new[]
            {
                new UserChatMessage(prompt)
            },
            cancellationToken: cancellationToken
        );

        return response.Value.Content[0].Text;
    }
}