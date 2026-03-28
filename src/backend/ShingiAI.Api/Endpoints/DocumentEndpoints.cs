using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using ShingiAI.Application.Interfaces;
using ShingiAI.Application.Models;

namespace ShingiAI.Api.Endpoints;

public static class DocumentEndpoints
{
    private const string RoutePrefix = "/documents";

    public static IEndpointRouteBuilder MapDocumentEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup(RoutePrefix)
                          .WithTags("Documents");

        group.MapPost("/ingest", IngestDocument)
             .WithName("IngestDocument");

        return routes;
    }

    public static async Task<Results<Ok, ValidationProblem>> IngestDocument(
        IngestDocumentRequest request,
        IDocumentIngestionService ingestionService,
        IValidator<IngestDocumentRequest> validator,
        CancellationToken cancellationToken)
    {
        var validationResult = await validator.ValidateAsync(request, cancellationToken);

        if (!validationResult.IsValid)
        {
            return TypedResults.ValidationProblem(validationResult.ToDictionary());
        }

        await ingestionService.IngestAsync(request, cancellationToken);

        return TypedResults.Ok();
    }
}