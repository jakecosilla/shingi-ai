using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using ShingiAI.Application.Interfaces;
using ShingiAI.Application.Models;

namespace ShingiAI.Api.Endpoints;

public static class AskEndpoints
{
    private const string RoutePrefix = "/ai";

    public static IEndpointRouteBuilder MapAskEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup(RoutePrefix)
                          .WithTags("AI");

        group.MapPost("/ask", PostAskEndpoint)
             .WithName("AskQuestion");

        return routes;
    }

    public static async Task<Results<Ok<AskResponse>, ValidationProblem>> PostAskEndpoint(
        AskRequest request,
        IRagService ragService,
        IValidator<AskRequest> validator,
        CancellationToken cancellationToken)
    {
        var validationResult = await validator.ValidateAsync(request, cancellationToken);

        if (!validationResult.IsValid)
        {
            return TypedResults.ValidationProblem(validationResult.ToDictionary());
        }

        var result = await ragService.AskAsync(request.Question, cancellationToken);

        return TypedResults.Ok(result);
    }
}