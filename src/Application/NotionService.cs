using LearningDay.Domain;

namespace LearningDay.Application;

public sealed class NotionService
{
    private readonly INotionRepository _notionRepository;
    private readonly IAiService _aiService;

    public NotionService(INotionRepository notionRepository, IAiService aiService)
    {
        _notionRepository = notionRepository;
        _aiService = aiService;
    }

    public async Task<Notion> CreateAsync(string title, CancellationToken cancellationToken)
    {
        var explanation = await _aiService.GenerateExplanationAsync(title, cancellationToken);
        var notion = new Notion(Guid.NewGuid(), title, explanation, DateTimeOffset.UtcNow);
        await _notionRepository.AddAsync(notion, cancellationToken);
        return notion;
    }

    public Task<IReadOnlyList<Notion>> GetAllAsync(CancellationToken cancellationToken)
        => _notionRepository.GetAllAsync(cancellationToken);

    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
        => _notionRepository.DeleteAsync(id, cancellationToken);
}
