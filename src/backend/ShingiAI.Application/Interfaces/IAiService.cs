namespace ShingiAI.Application.Interfaces;

public interface IAiService
{
    Task<string> AskAsync(string prompt, CancellationToken cancellationToken);
}