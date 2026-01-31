namespace LearningDay.Domain;

public sealed class Review
{
    public Review(Guid id, Guid notionId, string userAnswer, double score, string feedback, string idealAnswer, DateTimeOffset reviewedAt)
    {
        Id = id;
        NotionId = notionId;
        UserAnswer = userAnswer;
        Score = score;
        Feedback = feedback;
        IdealAnswer = idealAnswer;
        ReviewedAt = reviewedAt;
    }

    public Guid Id { get; }
    public Guid NotionId { get; }
    public string UserAnswer { get; }
    public double Score { get; }
    public string Feedback { get; }
    public string IdealAnswer { get; }
    public DateTimeOffset ReviewedAt { get; }
}
