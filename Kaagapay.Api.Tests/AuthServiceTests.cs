using Kaagapay.Api.Data;
using Kaagapay.Api.Dtos;
using Kaagapay.Api.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Xunit;

namespace Kaagapay.Api.Tests;

public class AuthServiceTests
{
    private KaagapayContext GetInMemoryContext()
    {
        // Creates a fresh, isolated database in memory for every test run
        var options = new DbContextOptionsBuilder<KaagapayContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        
        return new KaagapayContext(options);
    }

    [Fact]
    public async Task RegisterAsync_ValidDto_CreatesUserWithHashedPassword()
    {
        // 1. Arrange (Set up the dependencies and test data)
        var context = GetInMemoryContext();
        var jwtOptions = Options.Create(new JwtOptions {
            Key = "FakeKeyForTestingOnly1234567890",
            Issuer = "test",
            Audience = "test",
            ExpiresMinutes = 60
        });
        var authService = new AuthService(context, jwtOptions);

        var request = new RegisterRequest
        {
            UserName = "teststudent",
            Password = "MySecretPassword123",
            Role = "Student"
        };

        // 2. Act (Execute the method we are testing)
        var result = await authService.RegisterAsync(request);

        // 3. Assert (Verify the outcome matches our expectations)
        Assert.NotNull(result);
        Assert.Equal("teststudent", result.UserName);
        Assert.Equal("Student", result.Role);
        Assert.NotNull(result.PasswordHash);
        Assert.NotEqual("MySecretPassword123", result.PasswordHash); // Ensures hashing occurred
    }
}