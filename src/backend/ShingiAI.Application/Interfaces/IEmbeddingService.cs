namespace ShingiAI.Application.Interfaces;

public interface IEmbeddingService
{
    Task<float[]> GenerateAsync(string text, CancellationToken cancellationToken);
}