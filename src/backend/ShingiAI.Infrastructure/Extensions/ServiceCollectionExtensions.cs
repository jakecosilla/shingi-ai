using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using ShingiAI.Application.Interfaces;
using ShingiAI.Infrastructure.AI;
using ShingiAI.Infrastructure.Vector;

namespace ShingiAI.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // =============================
        // Options binding
        // =============================
        services.Configure<AiOptions>(
            configuration.GetSection(AiOptions.SectionName));

        services.Configure<OpenAiOptions>(
            configuration.GetSection(OpenAiOptions.SectionName));

        services.Configure<OllamaOptions>(
            configuration.GetSection(OllamaOptions.SectionName));

        // =============================
        // Register implementations
        // =============================
        services.AddSingleton<OpenAiService>();        // stateless, safe singleton
        services.AddHttpClient<OllamaService>();       // uses HttpClient
        services.AddHttpClient<IEmbeddingService, OllamaEmbeddingService>(client =>
        {
            client.BaseAddress = new Uri("http://localhost:11434");
        });
        // =============================
        // RAG Services
        // =============================
        services.AddSingleton<IVectorStore, InMemoryVectorStore>();
        

        // =============================
        // Dynamic provider selection
        // =============================
        services.AddScoped<IAiService>(sp =>
        {
            var env = sp.GetRequiredService<IHostEnvironment>();
            var aiOptions = sp.GetRequiredService<IOptions<AiOptions>>().Value;

            var provider = aiOptions.Provider;

            // Fallback if not explicitly set
            if (string.IsNullOrWhiteSpace(provider))
            {
                provider = env.IsDevelopment() ? "Ollama" : "OpenAI";
            }

            return provider switch
            {
                "Ollama" => sp.GetRequiredService<OllamaService>(),
                "OpenAI" => sp.GetRequiredService<OpenAiService>(),
                _ => throw new InvalidOperationException(
                    $"Unsupported AI provider: '{provider}'")
            };
        });     

        return services;
    }
}