FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /source

# Copy existing files and restore as distinct layers
COPY . .
RUN dotnet restore ShingiAI.slnx

# Compile and publish a release
WORKDIR /source/ShingiAI.Api
RUN dotnet publish -c Release -o /app/publish

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000

ENTRYPOINT ["dotnet", "ShingiAI.Api.dll"]
