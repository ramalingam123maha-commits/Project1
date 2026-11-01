namespace Store_App.API.Controllers;

using Microsoft.AspNetCore.Mvc;
using Store_App.Core.DTOs;
using Store_App.Services.Services;

/// <summary>
/// User management API endpoints
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<UsersController> _logger;

    public UsersController(IUserService userService, ILogger<UsersController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    /// <summary>
    /// Get all users
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<UserDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAll()
    {
        _logger.LogInformation("GET /api/users - Retrieving all users");
        var users = await _userService.GetAllUsersAsync();
        return Ok(ApiResponse<List<UserDto>>.SuccessResponse(users, "Users retrieved successfully"));
    }

    /// <summary>
    /// Get user by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetById(int id)
    {
        _logger.LogInformation("GET /api/users/{id} - Retrieving user {UserId}", id);
        var user = await _userService.GetUserByIdAsync(id);
        return Ok(ApiResponse<UserDto>.SuccessResponse(user, "User retrieved successfully"));
    }

    /// <summary>
    /// Create a new user
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Create([FromBody] CreateUserDto createUserDto)
    {
        _logger.LogInformation("POST /api/users - Creating new user {Email}", createUserDto.Email);
        var user = await _userService.CreateUserAsync(createUserDto);
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, 
            ApiResponse<UserDto>.SuccessResponse(user, "User created successfully"));
    }

    /// <summary>
    /// Update an existing user
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDto updateUserDto)
    {
        _logger.LogInformation("PUT /api/users/{id} - Updating user {UserId}", id);
        var user = await _userService.UpdateUserAsync(id, updateUserDto);
        return Ok(ApiResponse<UserDto>.SuccessResponse(user, "User updated successfully"));
    }

    /// <summary>
    /// Delete a user
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Delete(int id)
    {
        _logger.LogInformation("DELETE /api/users/{id} - Deleting user {UserId}", id);
        var result = await _userService.DeleteUserAsync(id);
        return Ok(ApiResponse.SuccessResponse("User deleted successfully"));
    }
}
