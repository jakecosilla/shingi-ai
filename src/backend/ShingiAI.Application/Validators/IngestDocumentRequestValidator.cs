using FluentValidation;
using ShingiAI.Application.Models;

namespace ShingiAI.Application.Validators;

public class IngestDocumentRequestValidator : AbstractValidator<IngestDocumentRequest>
{
    public IngestDocumentRequestValidator()
    {
        RuleFor(x => x.DocumentId)
            .NotEmpty()
            .WithMessage("DocumentId is required.");

        RuleFor(x => x.Content)
            .NotEmpty()
            .WithMessage("Content is required.")
            .MaximumLength(100_000); // safety limit
    }
}