namespace ShingiAI.Application.Models;

public record VectorSearchResult(
    string Id,
    string Content,
    double Score
);