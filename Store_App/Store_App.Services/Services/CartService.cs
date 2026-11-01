namespace Store_App.Services.Services;

using Store_App.Core.DTOs;
using Store_App.Core.Entities;
using Store_App.Data.Repositories;
using Store_App.Services.Exceptions;
using Microsoft.Extensions.Logging;

/// <summary>
/// Service for cart-related operations
/// </summary>
public class CartService : ICartService
{
    private readonly CartRepository _cartRepository;
    private readonly IRepository<Product> _productRepository;
    private readonly ILogger<CartService> _logger;

    public CartService(CartRepository cartRepository, IRepository<Product> productRepository, ILogger<CartService> logger)
    {
        _cartRepository = cartRepository;
        _productRepository = productRepository;
        _logger = logger;
    }

    public async Task<CartDto> GetCartByUserIdAsync(int userId)
    {
        _logger.LogInformation($"Fetching cart for user ID: {userId}");
        
        var cart = await _cartRepository.GetByUserIdAsync(userId);
        if (cart == null)
        {
            _logger.LogWarning($"Cart for user {userId} not found");
            throw new ResourceNotFoundException(nameof(Cart), userId);
        }

        return MapToDto(cart);
    }

    public async Task<CartDto> AddToCartAsync(int userId, AddToCartDto addToCartDto)
    {
        _logger.LogInformation($"Adding product {addToCartDto.ProductId} to cart for user {userId}");
        
        ValidateAddToCart(addToCartDto);

        // Get cart
        var cart = await _cartRepository.GetByUserIdAsync(userId);
        if (cart == null)
        {
            _logger.LogWarning($"Cart for user {userId} not found");
            throw new ResourceNotFoundException(nameof(Cart), userId);
        }

        // Get product
        var product = await _productRepository.GetByIdAsync(addToCartDto.ProductId);
        if (product == null)
        {
            _logger.LogWarning($"Product {addToCartDto.ProductId} not found");
            throw new ResourceNotFoundException(nameof(Product), addToCartDto.ProductId);
        }

        // Check stock
        var productRepository = (ProductRepository)_productRepository;
        var hasSufficientStock = await productRepository.HasSufficientStockAsync(product.Id, addToCartDto.Quantity);
        if (!hasSufficientStock)
        {
            _logger.LogWarning($"Insufficient stock for product {product.Id}");
            throw new BusinessRuleException($"Product {product.Name} has insufficient stock");
        }

        // Check if product already in cart
        var existingItem = cart.CartItems.FirstOrDefault(ci => ci.ProductId == product.Id);
        if (existingItem != null)
        {
            existingItem.Quantity += addToCartDto.Quantity;
            _logger.LogInformation($"Updated quantity for product {product.Id} in cart");
        }
        else
        {
            var cartItem = new CartItem
            {
                ProductId = product.Id,
                Product = product,
                Quantity = addToCartDto.Quantity,
                UnitPrice = product.Price
            };

            await _cartRepository.AddCartItemAsync(cart.Id, cartItem);
            _logger.LogInformation($"Product {product.Id} added to cart");
        }

        cart.UpdatedAt = DateTime.UtcNow;
        await _cartRepository.UpdateAsync(cart);

        return MapToDto(cart);
    }

    public async Task<bool> RemoveFromCartAsync(int userId, int cartItemId)
    {
        _logger.LogInformation($"Removing item {cartItemId} from cart for user {userId}");
        
        var cart = await _cartRepository.GetByUserIdAsync(userId);
        if (cart == null)
        {
            _logger.LogWarning($"Cart for user {userId} not found");
            throw new ResourceNotFoundException(nameof(Cart), userId);
        }

        var result = await _cartRepository.RemoveCartItemAsync(cart.Id, cartItemId);
        if (result)
        {
            _logger.LogInformation($"Item {cartItemId} removed from cart");
        }

        return result;
    }

    public async Task<bool> ClearCartAsync(int userId)
    {
        _logger.LogInformation($"Clearing cart for user {userId}");
        
        var cart = await _cartRepository.GetByUserIdAsync(userId);
        if (cart == null)
        {
            _logger.LogWarning($"Cart for user {userId} not found");
            throw new ResourceNotFoundException(nameof(Cart), userId);
        }

        var result = await _cartRepository.ClearCartAsync(cart.Id);
        if (result)
        {
            _logger.LogInformation($"Cart for user {userId} cleared");
        }

        return result;
    }

    public async Task<CartDto> UpdateCartItemAsync(int userId, int cartItemId, UpdateCartItemDto updateCartItemDto)
    {
        _logger.LogInformation($"Updating cart item {cartItemId} for user {userId}");
        
        if (updateCartItemDto.Quantity <= 0)
            throw new ValidationException("Quantity must be greater than 0", new List<string> { "Quantity must be greater than 0" });

        var cart = await _cartRepository.GetByUserIdAsync(userId);
        if (cart == null)
        {
            _logger.LogWarning($"Cart for user {userId} not found");
            throw new ResourceNotFoundException(nameof(Cart), userId);
        }

        var cartItem = cart.CartItems.FirstOrDefault(ci => ci.Id == cartItemId);
        if (cartItem == null)
        {
            _logger.LogWarning($"Cart item {cartItemId} not found");
            throw new ResourceNotFoundException(nameof(CartItem), cartItemId);
        }

        cartItem.Quantity = updateCartItemDto.Quantity;
        cart.UpdatedAt = DateTime.UtcNow;
        await _cartRepository.UpdateAsync(cart);

        _logger.LogInformation($"Cart item {cartItemId} quantity updated to {updateCartItemDto.Quantity}");

        return MapToDto(cart);
    }

    private void ValidateAddToCart(AddToCartDto addToCartDto)
    {
        var errors = new List<string>();

        if (addToCartDto.ProductId <= 0)
            errors.Add("Product ID must be valid");

        if (addToCartDto.Quantity <= 0)
            errors.Add("Quantity must be greater than 0");

        if (errors.Any())
            throw new ValidationException("Add to cart validation failed", errors);
    }

    private static CartDto MapToDto(Cart cart)
    {
        return new CartDto
        {
            Id = cart.Id,
            UserId = cart.UserId,
            CartItems = cart.CartItems.Select(ci => new CartItemDto
            {
                Id = ci.Id,
                ProductId = ci.ProductId,
                ProductName = ci.Product?.Name ?? "Unknown",
                Quantity = ci.Quantity,
                UnitPrice = ci.UnitPrice,
                AddedAt = ci.AddedAt
            }).ToList(),
            CreatedAt = cart.CreatedAt,
            UpdatedAt = cart.UpdatedAt
        };
    }
}
