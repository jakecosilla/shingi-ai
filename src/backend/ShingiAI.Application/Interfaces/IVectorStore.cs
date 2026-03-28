using ShingiAI.Application.Models;

namespace ShingiAI.Application.Interfaces;

public interface IVectorStore
{
    Task AddAsync(
        string id,
        float[] embedding,
        string content,
        CancellationToken cancellationToken);

    Task<IReadOnlyList<VectorSearchResult>> SearchAsync(
        float[] embedding,
        int topK,
        CancellationToken cancellationToken);
}