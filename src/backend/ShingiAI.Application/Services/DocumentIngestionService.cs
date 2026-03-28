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
        const int maxChunkSize = 800; // characters
        const int overlapSize = 150;  // characters
        
        if (string.IsNullOrWhiteSpace(text)) return new List<string>();

        var paragraphs = text.Split(new[] { "\r\n\r\n", "\n\n" }, StringSplitOptions.RemoveEmptyEntries);
        var chunks = new List<string>();
        var currentChunk = new System.Text.StringBuilder();

        foreach (var p in paragraphs)
        {
            var paragraph = p.Trim();
            if (currentChunk.Length + paragraph.Length > maxChunkSize && currentChunk.Length > 0)
            {
                chunks.Add(currentChunk.ToString().Trim());
                
                // Keep the end of the previous chunk for overlap
                var chunkStr = currentChunk.ToString();
                var overlapStart = Math.Max(0, chunkStr.Length - overlapSize);
                
                // Find nearest word boundary for clean overlap start
                if (overlapStart > 0)
                {
                    var spaceIndex = chunkStr.IndexOf(' ', overlapStart);
                    if (spaceIndex != -1) overlapStart = spaceIndex + 1;
                }
                
                currentChunk.Clear();
                currentChunk.Append(chunkStr.Substring(overlapStart) + "\n\n");
            }

            if (paragraph.Length > maxChunkSize)
            {
                // If a single paragraph is too big, split it by sentences
                var sentences = System.Text.RegularExpressions.Regex.Split(paragraph, @"(?<=[\.!\?])\s+");
                foreach (var sentence in sentences)
                {
                    if (currentChunk.Length + sentence.Length > maxChunkSize && currentChunk.Length > 0)
                    {
                        chunks.Add(currentChunk.ToString().Trim());
                        currentChunk.Clear();
                    }
                    currentChunk.Append(sentence + " ");
                }
            }
            else
            {
                currentChunk.Append(paragraph + "\n\n");
            }
        }

        if (currentChunk.Length > 0)
        {
            chunks.Add(currentChunk.ToString().Trim());
        }

        return chunks;
    }
}