namespace Store_App.Tests.Services;

using Xunit;
using Moq;
using Store_App.Core.DTOs;
using Store_App.Core.Entities;
using Store_App.Data;
using Store_App.Data.Repositories;
using Store_App.Services.Services;
using Store_App.Services.Exceptions;
using Microsoft.Extensions.Logging;

public class UserServiceTests
{
    private readonly UserService _userService;
    private readonly Mock<IRepository<User>> _mockUserRepository;
    private readonly Mock<ILogger<UserService>> _mockLogger;

    public UserServiceTests()
    {
        _mockUserRepository = new Mock<IRepository<User>>();
        _mockLogger = new Mock<ILogger<UserService>>();
        _userService = new UserService(_mockUserRepository.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task GetUserByIdAsync_WithValidId_ReturnsUserDto()
    {
        // Arrange
        var userId = 1;
        var user = new User { Id = userId, Name = "John Doe", Email = "john@example.com", PhoneNumber = "555-0001" };
        _mockUserRepository.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync(user);

        // Act
        var result = await _userService.GetUserByIdAsync(userId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(userId, result.Id);
        Assert.Equal("John Doe", result.Name);
        Assert.Equal("john@example.com", result.Email);
    }

    [Fact]
    public async Task GetUserByIdAsync_WithInvalidId_ThrowsResourceNotFoundException()
    {
        // Arrange
        var userId = 999;
        _mockUserRepository.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync((User?)null);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ResourceNotFoundException>(() => _userService.GetUserByIdAsync(userId));
        Assert.Contains("not found", exception.Message);
    }

    [Fact]
    public async Task GetAllUsersAsync_ReturnsListOfUsers()
    {
        // Arrange
        var users = new List<User>
        {
            new User { Id = 1, Name = "John Doe", Email = "john@example.com", PhoneNumber = "555-0001" },
            new User { Id = 2, Name = "Jane Smith", Email = "jane@example.com", PhoneNumber = "555-0002" }
        };
        _mockUserRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(users);

        // Act
        var result = await _userService.GetAllUsersAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count);
        Assert.Equal("John Doe", result[0].Name);
    }

    [Fact]
    public async Task CreateUserAsync_WithValidData_ReturnsCreatedUserDto()
    {
        // Arrange
        var createUserDto = new CreateUserDto
        {
            Name = "New User",
            Email = "newuser@example.com",
            PhoneNumber = "555-0003"
        };

        var createdUser = new User
        {
            Id = 1,
            Name = createUserDto.Name,
            Email = createUserDto.Email,
            PhoneNumber = createUserDto.PhoneNumber
        };

        _mockUserRepository.Setup(r => r.AddAsync(It.IsAny<User>())).ReturnsAsync(createdUser);

        // Act
        var result = await _userService.CreateUserAsync(createUserDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result.Id);
        Assert.Equal("New User", result.Name);
        _mockUserRepository.Verify(r => r.AddAsync(It.IsAny<User>()), Times.Once);
    }

    [Fact]
    public async Task CreateUserAsync_WithEmptyName_ThrowsValidationException()
    {
        // Arrange
        var createUserDto = new CreateUserDto
        {
            Name = "",
            Email = "newuser@example.com",
            PhoneNumber = "555-0003"
        };

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ValidationException>(() => _userService.CreateUserAsync(createUserDto));
        Assert.Contains("Name is required", exception.Details);
    }

    [Fact]
    public async Task UpdateUserAsync_WithValidData_ReturnsUpdatedUserDto()
    {
        // Arrange
        var userId = 1;
        var existingUser = new User { Id = userId, Name = "Old Name", Email = "old@example.com", PhoneNumber = "555-0001" };
        var updateUserDto = new UpdateUserDto
        {
            Name = "Updated Name",
            Email = "updated@example.com",
            PhoneNumber = "555-0002"
        };

        _mockUserRepository.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync(existingUser);
        _mockUserRepository.Setup(r => r.UpdateAsync(It.IsAny<User>())).ReturnsAsync(existingUser);

        // Act
        var result = await _userService.UpdateUserAsync(userId, updateUserDto);

        // Assert
        Assert.NotNull(result);
        _mockUserRepository.Verify(r => r.UpdateAsync(It.IsAny<User>()), Times.Once);
    }

    [Fact]
    public async Task DeleteUserAsync_WithValidId_ReturnsTrue()
    {
        // Arrange
        var userId = 1;
        _mockUserRepository.Setup(r => r.ExistsAsync(userId)).ReturnsAsync(true);
        _mockUserRepository.Setup(r => r.DeleteAsync(userId)).ReturnsAsync(true);

        // Act
        var result = await _userService.DeleteUserAsync(userId);

        // Assert
        Assert.True(result);
        _mockUserRepository.Verify(r => r.DeleteAsync(userId), Times.Once);
    }

    [Fact]
    public async Task DeleteUserAsync_WithInvalidId_ThrowsResourceNotFoundException()
    {
        // Arrange
        var userId = 999;
        _mockUserRepository.Setup(r => r.ExistsAsync(userId)).ReturnsAsync(false);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ResourceNotFoundException>(() => _userService.DeleteUserAsync(userId));
        Assert.Contains("not found", exception.Message);
    }
}
