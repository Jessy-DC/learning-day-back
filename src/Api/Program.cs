using LearningDay.Application;
using LearningDay.Infrastructure;
using Microsoft.AspNetCore.Http.HttpResults;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<INotionRepository, InMemoryNotionRepository>();
builder.Services.AddSingleton<IReviewRepository, InMemoryReviewRepository>();
builder.Services.AddSingleton<IAiService, MockAiService>();
builder.Services.AddSingleton<NotionService>();
builder.Services.AddSingleton<ReviewService>();

var app = builder.Build();

app.MapGet("/", () => Results.Ok(new { message = "Learning Day API" }));

app.MapPost("/notions", async Task<Results<Ok<NotionResponse>, BadRequest<string>>>(CreateNotionRequest request, NotionService service, CancellationToken cancellationToken) =>
{
    if (string.IsNullOrWhiteSpace(request.Title))
    {
        return TypedResults.BadRequest("Le titre est obligatoire.");
    }

    var notion = await service.CreateAsync(request.Title.Trim(), cancellationToken);
    return TypedResults.Ok(NotionResponse.From(notion));
});

app.MapGet("/notions", async Task<Ok<IReadOnlyList<NotionResponse>>>(NotionService service, CancellationToken cancellationToken) =>
{
    var notions = await service.GetAllAsync(cancellationToken);
    return TypedResults.Ok(notions.Select(NotionResponse.From).ToList());
});

app.MapGet("/reviews/next", async Task<Results<Ok<ReviewNotionResponse>, NotFound>>(ReviewService service, CancellationToken cancellationToken) =>
{
    var notion = await service.GetNextNotionAsync(cancellationToken);
    if (notion is null)
    {
        return TypedResults.NotFound();
    }

    return TypedResults.Ok(ReviewNotionResponse.From(notion));
});

app.MapPost("/reviews", async Task<Results<Ok<ReviewResponse>, NotFound, BadRequest<string>>>(CreateReviewRequest request, ReviewService service, CancellationToken cancellationToken) =>
{
    if (request.NotionId == Guid.Empty)
    {
        return TypedResults.BadRequest("La notion est obligatoire.");
    }

    if (string.IsNullOrWhiteSpace(request.UserAnswer))
    {
        return TypedResults.BadRequest("La réponse est obligatoire.");
    }

    var result = await service.EvaluateAsync(request.NotionId, request.UserAnswer.Trim(), cancellationToken);
    if (result is null)
    {
        return TypedResults.NotFound();
    }

    return TypedResults.Ok(ReviewResponse.From(result));
});

app.Run();

internal sealed record CreateNotionRequest(string Title);

internal sealed record NotionResponse(Guid Id, string Title, string Explanation, DateTimeOffset CreatedAt)
{
    public static NotionResponse From(LearningDay.Domain.Notion notion)
        => new(notion.Id, notion.Title, notion.Explanation, notion.CreatedAt);
}

internal sealed record ReviewNotionResponse(Guid Id, string Title, string Explanation)
{
    public static ReviewNotionResponse From(LearningDay.Domain.Notion notion)
        => new(notion.Id, notion.Title, notion.Explanation);
}

internal sealed record CreateReviewRequest(Guid NotionId, string UserAnswer);

internal sealed record ReviewResponse(Guid ReviewId, Guid NotionId, string UserAnswer, double Score, string Feedback, string IdealAnswer, DateTimeOffset ReviewedAt)
{
    public static ReviewResponse From(ReviewResult result)
        => new(result.Review.Id, result.Notion.Id, result.Review.UserAnswer, result.Review.Score, result.Review.Feedback, result.Review.IdealAnswer, result.Review.ReviewedAt);
}
