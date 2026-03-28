namespace ShingiAI.Application.Models;

public record AskResponse(
    string Answer,
    List<string> Sources,
    bool RequiresReview
);