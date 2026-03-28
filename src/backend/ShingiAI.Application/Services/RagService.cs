using ShingiAI.Application.Interfaces;
using ShingiAI.Application.Models;

namespace ShingiAI.Application.Services;

public class RagService : IRagService
{
    private readonly IAiService _aiService;
    private readonly IEmbeddingService _embeddingService;
    private readonly IVectorStore _vectorStore;

    public RagService(
        IAiService aiService,
        IEmbeddingService embeddingService,
        IVectorStore vectorStore)
    {
        _aiService = aiService;
        _embeddingService = embeddingService;
        _vectorStore = vectorStore;
    }

    public async Task<AskResponse> AskAsync(string question, CancellationToken cancellationToken)
    {
        // 1. Generate embedding from user query
        var queryEmbedding = await _embeddingService.GenerateAsync(question, cancellationToken);

        // 2. Retrieve relevant documents
        var results = await _vectorStore.SearchAsync(
            queryEmbedding,
            topK: 3,
            cancellationToken);

        // 3. Build context
        var context = string.Join("\n---\n", results.Select(r => r.Content));

        // 4. Build prompt (SINGLE SOURCE OF TRUTH)
        var prompt = $@"
            You are a legal assistant AI.

            Use ONLY the context below to answer the question.
            If the answer is not in the context, say you don't know.

            Context:
            {context}

            Question:
            {question}
            ";

        // 5. Call LLM
        var answer = await _aiService.AskAsync(prompt, cancellationToken);

        // 6. Return structured response
        return new AskResponse(
            Answer: answer,
            Sources: results.Select(r => r.Id).ToList(),
            RequiresReview: true
        );
    }
}