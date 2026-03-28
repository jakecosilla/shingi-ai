using System.Net.Http.Json;
using Microsoft.Extensions.Options;
using ShingiAI.Application.Interfaces;

namespace ShingiAI.Infrastructure.AI;

public class OllamaService : IAiService
{
    private readonly HttpClient _http;
    private readonly OllamaOptions _options;

    public OllamaService(HttpClient http, IOptions<OllamaOptions> options)
    {
        _http = http;
        _options = options.Value;
    }

    public async Task<string> AskAsync(string prompt, CancellationToken cancellationToken)
    {
        var response = await _http.PostAsJsonAsync(
            $"{_options.BaseUrl}/api/generate",
            new
            {
                model = _options.Model,
                prompt,
                stream = false
            },
            cancellationToken
        );

        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<OllamaResponse>(cancellationToken: cancellationToken);

        return result?.response ?? string.Empty;
    }

    private record OllamaResponse(string response);
}