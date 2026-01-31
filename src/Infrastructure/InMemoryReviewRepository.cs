using System.Collections.Concurrent;
using LearningDay.Application;
using LearningDay.Domain;

namespace LearningDay.Infrastructure;

public sealed class InMemoryReviewRepository : IReviewRepository
{
    private readonly ConcurrentDictionary<Guid, List<Review>> _store = new();

    public Task AddAsync(Review review, CancellationToken cancellationToken)
    {
        var list = _store.GetOrAdd(review.NotionId, _ => new List<Review>());
        lock (list)
        {
            list.Add(review);
        }

        return Task.CompletedTask;
    }

    public Task<IReadOnlyList<Review>> GetByNotionIdAsync(Guid notionId, CancellationToken cancellationToken)
    {
        if (_store.TryGetValue(notionId, out var list))
        {
            lock (list)
            {
                return Task.FromResult<IReadOnlyList<Review>>(list.ToList());
            }
        }

        return Task.FromResult<IReadOnlyList<Review>>(Array.Empty<Review>());
    }
}
