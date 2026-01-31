using LearningDay.Application;
using LearningDay.Domain;

namespace LearningDay.Infrastructure;

public sealed class MockAiService : IAiService
{
    public Task<string> GenerateExplanationAsync(string title, CancellationToken cancellationToken)
    {
        var explanation = $"Explication courte pour: {title}.";
        return Task.FromResult(explanation);
    }

    public Task<AiReviewResult> EvaluateAsync(Notion notion, string userAnswer, CancellationToken cancellationToken)
    {
        var trimmed = userAnswer.Trim();
        var score = string.IsNullOrWhiteSpace(trimmed) ? 0.1 : Math.Min(1.0, trimmed.Length / 120.0 + 0.2);
        var feedback = score switch
        {
            < 0.4 => "Réponse trop courte, pensez à détailler davantage.",
            < 0.7 => "Bonne base, mais quelques détails manquent.",
            _ => "Très bonne réponse, continuez ainsi."
        };
        var idealAnswer = notion.Explanation;

        return Task.FromResult(new AiReviewResult(score, feedback, idealAnswer));
    }
}
