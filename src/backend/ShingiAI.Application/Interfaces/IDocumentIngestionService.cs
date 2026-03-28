using ShingiAI.Application.Models;

namespace ShingiAI.Application.Interfaces;

public interface IDocumentIngestionService
{
    Task IngestAsync(IngestDocumentRequest request, CancellationToken cancellationToken);
}