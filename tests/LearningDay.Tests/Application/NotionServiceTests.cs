using LearningDay.Application;
using LearningDay.Domain;
using Moq;

namespace LearningDay.Tests.Application;

public sealed class NotionServiceTests
{
    [Fact]
    public async Task CreateAsync_ShouldGenerateExplanationAndPersistNotion()
    {
        var notionRepository = new Mock<INotionRepository>();
        var aiService = new Mock<IAiService>();
        aiService
            .Setup(service => service.GenerateExplanationAsync("Architecture propre", It.IsAny<CancellationToken>()))
            .ReturnsAsync("Une architecture organisée en couches.");

        Notion? savedNotion = null;
        notionRepository
            .Setup(repository => repository.AddAsync(It.IsAny<Notion>(), It.IsAny<CancellationToken>()))
            .Callback<Notion, CancellationToken>((notion, _) => savedNotion = notion)
            .Returns(Task.CompletedTask);

        var service = new NotionService(notionRepository.Object, aiService.Object);

        var notion = await service.CreateAsync("Architecture propre", CancellationToken.None);

        Assert.NotEqual(Guid.Empty, notion.Id);
        Assert.Equal("Architecture propre", notion.Title);
        Assert.Equal("Une architecture organisée en couches.", notion.Explanation);
        Assert.NotNull(savedNotion);
        Assert.Equal(notion.Id, savedNotion!.Id);

        aiService.Verify(service => service.GenerateExplanationAsync("Architecture propre", It.IsAny<CancellationToken>()), Times.Once);
        notionRepository.Verify(repository => repository.AddAsync(It.IsAny<Notion>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnRepositoryValues()
    {
        var notionRepository = new Mock<INotionRepository>();
        var aiService = new Mock<IAiService>();

        IReadOnlyList<Notion> expected =
        [
            new Notion(Guid.NewGuid(), "HTTP", "Protocole web", DateTimeOffset.UtcNow),
            new Notion(Guid.NewGuid(), "REST", "Style d'architecture", DateTimeOffset.UtcNow)
        ];

        notionRepository
            .Setup(repository => repository.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(expected);

        var service = new NotionService(notionRepository.Object, aiService.Object);

        var notions = await service.GetAllAsync(CancellationToken.None);

        Assert.Equal(2, notions.Count);
        Assert.Equal("HTTP", notions[0].Title);
        Assert.Equal("REST", notions[1].Title);
    }
}
