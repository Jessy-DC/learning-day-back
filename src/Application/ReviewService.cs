using LearningDay.Domain;

namespace LearningDay.Application;

public sealed class ReviewService
{
    private readonly INotionRepository _notionRepository;
    private readonly IReviewRepository _reviewRepository;
    private readonly IAiService _aiService;

    public ReviewService(INotionRepository notionRepository, IReviewRepository reviewRepository, IAiService aiService)
    {
        _notionRepository = notionRepository;
        _reviewRepository = reviewRepository;
        _aiService = aiService;
    }

    public async Task<Notion?> GetNextNotionAsync(CancellationToken cancellationToken)
    {
        var notions = await _notionRepository.GetAllAsync(cancellationToken);
        if (notions.Count == 0)
        {
            return null;
        }

        var index = Random.Shared.Next(notions.Count);
        return notions[index];
    }

    public async Task<ReviewResult?> EvaluateAsync(Guid notionId, string userAnswer, CancellationToken cancellationToken)
    {
        var notion = await _notionRepository.GetByIdAsync(notionId, cancellationToken);
        if (notion is null)
        {
            return null;
        }

        var aiResult = await _aiService.EvaluateAsync(notion, userAnswer, cancellationToken);
        var review = new Review(Guid.NewGuid(), notion.Id, userAnswer, aiResult.Score, aiResult.Feedback, aiResult.IdealAnswer, DateTimeOffset.UtcNow);

        await _reviewRepository.AddAsync(review, cancellationToken);

        return new ReviewResult(notion, review);
    }
}

public sealed record ReviewResult(Notion Notion, Review Review);
