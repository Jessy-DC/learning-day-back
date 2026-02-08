using System.Collections.Concurrent;
using LearningDay.Application;
using LearningDay.Domain;

namespace LearningDay.Infrastructure;

public sealed class InMemoryNotionRepository : INotionRepository
{
    private readonly ConcurrentDictionary<Guid, Notion> _store = new();

    public Task AddAsync(Notion notion, CancellationToken cancellationToken)
    {
        _store[notion.Id] = notion;
        return Task.CompletedTask;
    }

    public Task<IReadOnlyList<Notion>> GetAllAsync(CancellationToken cancellationToken)
    {
        IReadOnlyList<Notion> notions = _store.Values
            .OrderBy(notion => notion.CreatedAt)
            .ToList();
        return Task.FromResult(notions);
    }

    public Task<Notion?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        _store.TryGetValue(id, out var notion);
        return Task.FromResult(notion);
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var deleted = _store.TryRemove(id, out _);
        return Task.FromResult(deleted);
    }
}
