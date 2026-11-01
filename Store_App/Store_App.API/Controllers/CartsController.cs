namespace Store_App.API.Controllers;

using Microsoft.AspNetCore.Mvc;
using Store_App.Core.DTOs;
using Store_App.Services.Services;

/// <summary>
/// Shopping cart API endpoints
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class CartsController : ControllerBase
{
    private readonly ICartService _cartService;
    private readonly ILogger<CartsController> _logger;

    public CartsController(ICartService cartService, ILogger<CartsController> logger)
    {
        _cartService = cartService;
        _logger = logger;
    }

    /// <summary>
    /// Get cart for a user
    /// </summary>
    [HttpGet("user/{userId}")]
    [ProducesResponseType(typeof(ApiResponse<CartDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetCart(int userId)
    {
        _logger.LogInformation("GET /api/carts/user/{userId} - Retrieving cart for user {UserId}", userId);
        var cart = await _cartService.GetCartByUserIdAsync(userId);
        return Ok(ApiResponse<CartDto>.SuccessResponse(cart, "Cart retrieved successfully"));
    }

    /// <summary>
    /// Add product to cart
    /// </summary>
    [HttpPost("user/{userId}/add")]
    [ProducesResponseType(typeof(ApiResponse<CartDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> AddToCart(int userId, [FromBody] AddToCartDto addToCartDto)
    {
        _logger.LogInformation("POST /api/carts/user/{userId}/add - Adding product to cart", userId);
        var cart = await _cartService.AddToCartAsync(userId, addToCartDto);
        return Ok(ApiResponse<CartDto>.SuccessResponse(cart, "Product added to cart successfully"));
    }

    /// <summary>
    /// Remove item from cart
    /// </summary>
    [HttpDelete("user/{userId}/items/{cartItemId}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> RemoveFromCart(int userId, int cartItemId)
    {
        _logger.LogInformation("DELETE /api/carts/user/{userId}/items/{cartItemId} - Removing item from cart", userId);
        var result = await _cartService.RemoveFromCartAsync(userId, cartItemId);
        return Ok(ApiResponse.SuccessResponse("Item removed from cart successfully"));
    }

    /// <summary>
    /// Update cart item quantity
    /// </summary>
    [HttpPut("user/{userId}/items/{cartItemId}")]
    [ProducesResponseType(typeof(ApiResponse<CartDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdateCartItem(int userId, int cartItemId, [FromBody] UpdateCartItemDto updateCartItemDto)
    {
        _logger.LogInformation("PUT /api/carts/user/{userId}/items/{cartItemId} - Updating cart item", userId);
        var cart = await _cartService.UpdateCartItemAsync(userId, cartItemId, updateCartItemDto);
        return Ok(ApiResponse<CartDto>.SuccessResponse(cart, "Cart item updated successfully"));
    }

    /// <summary>
    /// Clear all items from cart
    /// </summary>
    [HttpDelete("user/{userId}/clear")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> ClearCart(int userId)
    {
        _logger.LogInformation("DELETE /api/carts/user/{userId}/clear - Clearing cart", userId);
        var result = await _cartService.ClearCartAsync(userId);
        return Ok(ApiResponse.SuccessResponse("Cart cleared successfully"));
    }
}
