namespace Store_App.Services.Services;

using Store_App.Core.DTOs;
using Store_App.Core.Entities;
using Store_App.Data.Repositories;
using Store_App.Services.Exceptions;
using Microsoft.Extensions.Logging;

/// <summary>
/// Service for user-related operations
/// </summary>
public class UserService : IUserService
{
    private readonly IRepository<User> _userRepository;
    private readonly ILogger<UserService> _logger;

    public UserService(IRepository<User> userRepository, ILogger<UserService> logger)
    {
        _userRepository = userRepository;
        _logger = logger;
    }

    public async Task<UserDto> GetUserByIdAsync(int id)
    {
        _logger.LogInformation($"Fetching user with ID: {id}");
        
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
        {
            _logger.LogWarning($"User with ID {id} not found");
            throw new ResourceNotFoundException(nameof(User), id);
        }

        return MapToDto(user);
    }

    public async Task<List<UserDto>> GetAllUsersAsync()
    {
        _logger.LogInformation("Fetching all users");
        
        var users = await _userRepository.GetAllAsync();
        return users.Select(MapToDto).ToList();
    }

    public async Task<UserDto> CreateUserAsync(CreateUserDto createUserDto)
    {
        _logger.LogInformation($"Creating new user: {createUserDto.Email}");
        
        ValidateUserDto(createUserDto);

        var user = new User
        {
            Name = createUserDto.Name,
            Email = createUserDto.Email,
            PhoneNumber = createUserDto.PhoneNumber
        };

        var createdUser = await _userRepository.AddAsync(user);
        _logger.LogInformation($"User created successfully with ID: {createdUser.Id}");

        return MapToDto(createdUser);
    }

    public async Task<UserDto> UpdateUserAsync(int id, UpdateUserDto updateUserDto)
    {
        _logger.LogInformation($"Updating user with ID: {id}");
        
        ValidateUserDto(updateUserDto);

        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
        {
            _logger.LogWarning($"User with ID {id} not found for update");
            throw new ResourceNotFoundException(nameof(User), id);
        }

        user.Name = updateUserDto.Name;
        user.Email = updateUserDto.Email;
        user.PhoneNumber = updateUserDto.PhoneNumber;

        var updatedUser = await _userRepository.UpdateAsync(user);
        _logger.LogInformation($"User with ID {id} updated successfully");

        return MapToDto(updatedUser);
    }

    public async Task<bool> DeleteUserAsync(int id)
    {
        _logger.LogInformation($"Deleting user with ID: {id}");
        
        var exists = await _userRepository.ExistsAsync(id);
        if (!exists)
        {
            _logger.LogWarning($"User with ID {id} not found for deletion");
            throw new ResourceNotFoundException(nameof(User), id);
        }

        var result = await _userRepository.DeleteAsync(id);
        _logger.LogInformation($"User with ID {id} deleted successfully");

        return result;
    }

    private void ValidateUserDto(CreateUserDto createUserDto)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(createUserDto.Name))
            errors.Add("Name is required");

        if (string.IsNullOrWhiteSpace(createUserDto.Email))
            errors.Add("Email is required");

        if (string.IsNullOrWhiteSpace(createUserDto.PhoneNumber))
            errors.Add("PhoneNumber is required");

        if (errors.Any())
            throw new ValidationException("User validation failed", errors);
    }

    private void ValidateUserDto(UpdateUserDto updateUserDto)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(updateUserDto.Name))
            errors.Add("Name is required");

        if (string.IsNullOrWhiteSpace(updateUserDto.Email))
            errors.Add("Email is required");

        if (string.IsNullOrWhiteSpace(updateUserDto.PhoneNumber))
            errors.Add("PhoneNumber is required");

        if (errors.Any())
            throw new ValidationException("User validation failed", errors);
    }

    private static UserDto MapToDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            CreatedAt = user.CreatedAt
        };
    }
}
