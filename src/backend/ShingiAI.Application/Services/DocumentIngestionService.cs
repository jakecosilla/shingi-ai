using ShingiAI.Application.Interfaces;
using ShingiAI.Application.Models;

namespace ShingiAI.Application.Services;

public class DocumentIngestionService : IDocumentIngestionService
{
    private readonly IEmbeddingService _embeddingService;
    private readonly IVectorStore _vectorStore;

    public DocumentIngestionService(
        IEmbeddingService embeddingService,
        IVectorStore vectorStore)
    {
        _embeddingService = embeddingService;
        _vectorStore = vectorStore;
    }

    public async Task IngestAsync(
        IngestDocumentRequest request,
        CancellationToken cancellationToken)
    {
        // 1. Chunk document
        var chunks = ChunkText(request.Content);

        // 2. Process each chunk
        int index = 0;

        foreach (var chunk in chunks)
        {
            var chunkId = $"{request.DocumentId}-chunk-{index++}";

            // 3. Generate embedding
            var embedding = await _embeddingService.GenerateAsync(chunk, cancellationToken);

            // 4. Store
            await _vectorStore.AddAsync(
                chunkId,
                embedding,
                chunk,
                cancellationToken);
        }
    }

    private static List<string> ChunkText(string text)
    {
        const int chunkSize = 500; // characters

        var chunks = new List<string>();

        for (int i = 0; i < text.Length; i += chunkSize)
        {
            var length = Math.Min(chunkSize, text.Length - i);
            chunks.Add(text.Substring(i, length));
        }

        return chunks;
    }
}