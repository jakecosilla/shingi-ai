namespace ShingiAI.Infrastructure.AI;

public class AiOptions
{
    public const string SectionName = "AI";

    public string? Provider { get; set; } // optional (env-driven)
}