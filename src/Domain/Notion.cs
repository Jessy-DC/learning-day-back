namespace LearningDay.Domain;

public sealed class Notion
{
    public Notion(Guid id, string title, string explanation, DateTimeOffset createdAt)
    {
        Id = id;
        Title = title;
        Explanation = explanation;
        CreatedAt = createdAt;
    }

    public Guid Id { get; }
    public string Title { get; }
    public string Explanation { get; }
    public DateTimeOffset CreatedAt { get; }
}
