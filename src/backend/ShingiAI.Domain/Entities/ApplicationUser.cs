using Microsoft.AspNetCore.Identity;

namespace ShingiAI.Domain.Entities;

public class ApplicationUser : IdentityUser
{
    public string? FullName { get; set; }
}
