using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace LearningDay.Tests.Api;

public sealed class NotionsEndpointsTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _httpClient;

    public NotionsEndpointsTests(WebApplicationFactory<Program> factory)
    {
        _httpClient = factory.CreateClient();
    }

    [Fact]
    public async Task PostNotions_ThenGetNotions_ShouldReturnCreatedNotion()
    {
        var createResponse = await _httpClient.PostAsJsonAsync("/notions", new { title = "CQRS" });

        createResponse.EnsureSuccessStatusCode();
        var createdNotion = await createResponse.Content.ReadFromJsonAsync<NotionDto>();

        Assert.NotNull(createdNotion);
        Assert.Equal("CQRS", createdNotion!.Title);
        Assert.False(string.IsNullOrWhiteSpace(createdNotion.Explanation));

        var getResponse = await _httpClient.GetAsync("/notions");

        getResponse.EnsureSuccessStatusCode();
        var notions = await getResponse.Content.ReadFromJsonAsync<List<NotionDto>>();

        Assert.NotNull(notions);
        Assert.Contains(notions!, notion => notion.Id == createdNotion.Id && notion.Title == "CQRS");
    }

    [Fact]
    public async Task PostNotions_WithEmptyTitle_ShouldReturnBadRequest()
    {
        var response = await _httpClient.PostAsJsonAsync("/notions", new { title = "" });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    private sealed record NotionDto(Guid Id, string Title, string Explanation, DateTimeOffset CreatedAt);
}
