using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ShingiAI.Domain.Entities;
using ShingiAI.Infrastructure.Auth;

namespace ShingiAI.Api.Endpoints;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/auth")
                          .WithTags("Auth");

        group.MapPost("/register", Register)
             .WithName("Register");

        group.MapPost("/login", Login)
             .WithName("Login");

        return routes;
    }

    public static async Task<IResult> Register(
        [FromBody] RegisterRequest request,
        UserManager<ApplicationUser> userManager)
    {
        var user = new ApplicationUser 
        { 
            UserName = request.Email, 
            Email = request.Email, 
            FullName = request.FullName 
        };
        
        var result = await userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            return Results.BadRequest(result.Errors);
        }

        await userManager.AddToRoleAsync(user, "User");

        return Results.Ok(new { Message = "User registered successfully" });
    }

    public static async Task<IResult> Login(
        [FromBody] LoginRequest request,
        UserManager<ApplicationUser> userManager,
        JwtTokenService jwtTokenService)
    {
        var user = await userManager.FindByEmailAsync(request.Email);

        if (user == null || !await userManager.CheckPasswordAsync(user, request.Password))
        {
            return Results.Unauthorized();
        }

        var roles = await userManager.GetRolesAsync(user);
        var token = jwtTokenService.CreateToken(user, roles);

        return Results.Ok(new { Token = token, Email = user.Email, FullName = user.FullName });
    }
}

public record RegisterRequest(
    [Required] [EmailAddress] string Email, 
    [Required] string Password, 
    string FullName);

public record LoginRequest(
    [Required] [EmailAddress] string Email, 
    [Required] string Password);
