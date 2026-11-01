namespace Store_App.Services.Services;

using Store_App.Core.DTOs;

/// <summary>
/// Interface for cart service operations
/// </summary>
public interface ICartService
{
    Task<CartDto> GetCartByUserIdAsync(int userId);
    Task<CartDto> AddToCartAsync(int userId, AddToCartDto addToCartDto);
    Task<bool> RemoveFromCartAsync(int userId, int cartItemId);
    Task<bool> ClearCartAsync(int userId);
    Task<CartDto> UpdateCartItemAsync(int userId, int cartItemId, UpdateCartItemDto updateCartItemDto);
}
