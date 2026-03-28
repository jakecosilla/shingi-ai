using Scalar.AspNetCore;
using ShingiAI.Api.Endpoints;
using ShingiAI.Application.Extensions;
using ShingiAI.Infrastructure.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi()
.AddApplication()
.AddInfrastructure(builder.Configuration);;

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.MapAskEndpoints();
app.MapDocumentEndpoints();

app.Run();
