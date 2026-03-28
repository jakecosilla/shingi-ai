using ShingiAI.Application.Interfaces;
using ShingiAI.Application.Models;

namespace ShingiAI.Infrastructure.Vector;

public class InMemoryVectorStore : IVectorStore
{
    private readonly List<(string Id, float[] Embedding, string Content)> _store = [];

    public Task AddAsync(string id, float[] embedding, string content, CancellationToken ct)
    {
        _store.Add((id, embedding, content));
        return Task.CompletedTask;
    }

    public Task<IReadOnlyList<VectorSearchResult>> SearchAsync(
        float[] embedding,
        int topK,
        CancellationToken ct)
    {
        var results = _store
            .Select(item => new VectorSearchResult(
                item.Id,
                item.Content,
                CosineSimilarity(embedding, item.Embedding)
            ))
            .OrderByDescending(x => x.Score)
            .Take(topK)
            .ToList();

        return Task.FromResult<IReadOnlyList<VectorSearchResult>>(results);
    }

    private static double CosineSimilarity(float[] a, float[] b)
    {
        double dot = 0, magA = 0, magB = 0;

        for (int i = 0; i < a.Length; i++)
        {
            dot += a[i] * b[i];
            magA += a[i] * a[i];
            magB += b[i] * b[i];
        }

        return dot / (Math.Sqrt(magA) * Math.Sqrt(magB) + 1e-10);
    }
}