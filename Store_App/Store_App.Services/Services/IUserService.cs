namespace Store_App.Services.Services;

using Store_App.Core.DTOs;

/// <summary>
/// Interface for user service operations
/// </summary>
public interface IUserService
{
    Task<UserDto> GetUserByIdAsync(int id);
    Task<List<UserDto>> GetAllUsersAsync();
    Task<UserDto> CreateUserAsync(CreateUserDto createUserDto);
    Task<UserDto> UpdateUserAsync(int id, UpdateUserDto updateUserDto);
    Task<bool> DeleteUserAsync(int id);
}
