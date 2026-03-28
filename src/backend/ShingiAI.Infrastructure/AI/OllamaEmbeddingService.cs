using System.Net.Http.Json;
using ShingiAI.Application.Interfaces;

namespace ShingiAI.Infrastructure.AI;

public class OllamaEmbeddingService : IEmbeddingService
{
    private readonly HttpClient _httpClient;

    public OllamaEmbeddingService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<float[]> GenerateAsync(string text, CancellationToken cancellationToken)
    {
        var response = await _httpClient.PostAsJsonAsync(
            "/api/embeddings",
            new
            {
                model = "nomic-embed-text",
                prompt = text
            },
            cancellationToken
        );

        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<OllamaEmbeddingResponse>(cancellationToken: cancellationToken);

        return result?.Embedding ?? Array.Empty<float>();
    }

  private record OllamaEmbeddingResponse(float[] Embedding);

}