using LearningDay.Domain;

namespace LearningDay.Application;

public interface INotionRepository
{
    Task AddAsync(Notion notion, CancellationToken cancellationToken);
    Task<IReadOnlyList<Notion>> GetAllAsync(CancellationToken cancellationToken);
    Task<Notion?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}

public interface IReviewRepository
{
    Task AddAsync(Review review, CancellationToken cancellationToken);
    Task<IReadOnlyList<Review>> GetByNotionIdAsync(Guid notionId, CancellationToken cancellationToken);
}

public interface IAiService
{
    Task<string> GenerateExplanationAsync(string title, CancellationToken cancellationToken);
    Task<AiReviewResult> EvaluateAsync(Notion notion, string userAnswer, CancellationToken cancellationToken);
}

public sealed record AiReviewResult(double Score, string Feedback, string IdealAnswer);
