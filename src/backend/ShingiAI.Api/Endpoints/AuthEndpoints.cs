using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ShingiAI.Domain.Entities;
using ShingiAI.Infrastructure.Auth;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;

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

    private static string DecryptPassword(string encryptedPassword, string clientSecret)
    {
        try 
        {
            // ClientSecret is our shared encryption key
            var key = SHA256.HashData(Encoding.UTF8.GetBytes(clientSecret));
            var fullCipher = Convert.FromBase64String(encryptedPassword);
            
            using var aes = Aes.Create();
            aes.Key = key;
            
            // Extract IV (first 16 bytes)
            var iv = new byte[16];
            Array.Copy(fullCipher, 0, iv, 0, 16);
            aes.IV = iv;

            using var decryptor = aes.CreateDecryptor();
            var cipherText = new byte[fullCipher.Length - 16];
            Array.Copy(fullCipher, 16, cipherText, 0, cipherText.Length);
            
            var decryptedData = decryptor.TransformFinalBlock(cipherText, 0, cipherText.Length);
            return Encoding.UTF8.GetString(decryptedData);
        }
        catch (Exception ex)
        {
            throw new Exception("Decryption failed. Ensure the client secret matches.", ex);
        }
    }

    public static async Task<IResult> Register(
        [FromBody] RegisterRequest request,
        UserManager<ApplicationUser> userManager,
        IOptions<JwtOptions> jwtOptions)
    {
        var password = request.Password;
        if (!string.IsNullOrEmpty(jwtOptions.Value.ClientSecret))
        {
            password = DecryptPassword(request.Password, jwtOptions.Value.ClientSecret);
        }

        var user = new ApplicationUser 
        { 
            UserName = request.Email, 
            Email = request.Email, 
            FullName = request.FullName 
        };
        
        var result = await userManager.CreateAsync(user, password);

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
        JwtTokenService jwtTokenService,
        IOptions<JwtOptions> jwtOptions)
    {
        var password = request.Password;
        if (!string.IsNullOrEmpty(jwtOptions.Value.ClientSecret))
        {
            password = DecryptPassword(request.Password, jwtOptions.Value.ClientSecret);
        }

        var user = await userManager.FindByEmailAsync(request.Email);

        if (user == null || !await userManager.CheckPasswordAsync(user, password))
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
