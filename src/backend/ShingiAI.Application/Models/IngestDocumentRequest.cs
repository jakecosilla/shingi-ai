namespace ShingiAI.Application.Models;

public record IngestDocumentRequest(
    string DocumentId,
    string Content
);