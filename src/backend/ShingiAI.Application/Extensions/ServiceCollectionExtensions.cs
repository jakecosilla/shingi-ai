using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using ShingiAI.Application.Interfaces;
using ShingiAI.Application.Services;

namespace ShingiAI.Application.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IRagService, RagService>();
        services.AddScoped<IDocumentIngestionService, DocumentIngestionService>();

        // Register validators
        services.AddValidatorsFromAssemblyContaining<ApplicationAssemblyMarker>(ServiceLifetime.Scoped);
        return services;
    }
}

public sealed class ApplicationAssemblyMarker; // Marker class for assembly scanning