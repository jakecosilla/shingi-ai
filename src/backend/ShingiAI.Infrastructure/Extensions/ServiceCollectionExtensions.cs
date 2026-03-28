using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ShingiAI.Application.Interfaces;
using ShingiAI.Infrastructure.AI;
using ShingiAI.Infrastructure.Auth;
using ShingiAI.Infrastructure.Data;
using ShingiAI.Infrastructure.Vector;
using ShingiAI.Domain.Entities;

namespace ShingiAI.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // =============================
        // Options binding
        // =============================
        services.Configure<AiOptions>(
            configuration.GetSection(AiOptions.SectionName));

        services.Configure<OpenAiOptions>(
            configuration.GetSection(OpenAiOptions.SectionName));

        services.Configure<OllamaOptions>(
            configuration.GetSection(OllamaOptions.SectionName));

        var jwtSection = configuration.GetSection(JwtOptions.SectionName);
        services.Configure<JwtOptions>(jwtSection);
        var jwtOptions = jwtSection.Get<JwtOptions>() ?? new JwtOptions();

        // =============================
        // Database & Identity
        // =============================
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlite(configuration.GetConnectionString("DefaultConnection")));

        services.AddIdentity<ApplicationUser, IdentityRole>(options => {
            options.Password.RequireDigit = true;
            options.Password.RequireLowercase = true;
            options.Password.RequireNonAlphanumeric = true;
            options.Password.RequireUppercase = true;
            options.Password.RequiredLength = 8;
        })
        .AddEntityFrameworkStores<ApplicationDbContext>()
        .AddDefaultTokenProviders();

        // =============================
        // Authentication & JWT
        // =============================
        services.AddAuthentication(options => {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options => {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtOptions.Issuer,
                ValidAudience = jwtOptions.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Secret))
            };
        });

        services.AddAuthorization();

        // =============================
        // Register implementations
        // =============================
        services.AddSingleton<OpenAiService>();        // stateless, safe singleton
        services.AddSingleton<JwtTokenService>();
        services.AddHttpClient<OllamaService>();       // uses HttpClient
        services.AddHttpClient<IEmbeddingService, OllamaEmbeddingService>(client =>
        {
            client.BaseAddress = new Uri("http://localhost:11434");
        });
        // =============================
        // RAG Services
        // =============================
        services.AddSingleton<IVectorStore, InMemoryVectorStore>();
        

        // =============================
        // Dynamic provider selection
        // =============================
        services.AddScoped<IAiService>(sp =>
        {
            var env = sp.GetRequiredService<IHostEnvironment>();
            var aiOptions = sp.GetRequiredService<IOptions<AiOptions>>().Value;

            var provider = aiOptions.Provider;

            // Fallback if not explicitly set
            if (string.IsNullOrWhiteSpace(provider))
            {
                provider = env.IsDevelopment() ? "Ollama" : "OpenAI";
            }

            return provider switch
            {
                "Ollama" => sp.GetRequiredService<OllamaService>(),
                "OpenAI" => sp.GetRequiredService<OpenAiService>(),
                _ => throw new InvalidOperationException(
                    $"Unsupported AI provider: '{provider}'")
            };
        });     

        return services;
    }
}