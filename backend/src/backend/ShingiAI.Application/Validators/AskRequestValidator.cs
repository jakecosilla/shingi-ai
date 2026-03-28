using FluentValidation;
using ShingiAI.Application.Models;

namespace ShingiAI.Application.Validators;

public class AskRequestValidator : AbstractValidator<AskRequest>
{
    public AskRequestValidator()
    {
        RuleFor(x => x.Question)
            .NotEmpty()
            .WithMessage("Question is required.")
            .MaximumLength(1000)
            .WithMessage("Question must not exceed 1000 characters.");
    }
}