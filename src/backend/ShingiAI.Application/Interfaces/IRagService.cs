using ShingiAI.Application.Models;

namespace ShingiAI.Application.Interfaces;

public interface IRagService
{
    Task<AskResponse> AskAsync(string question, CancellationToken cancellationToken);
}