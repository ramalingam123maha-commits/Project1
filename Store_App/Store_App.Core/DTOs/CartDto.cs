namespace Store_App.Core.DTOs;

/// <summary>
/// Data Transfer Object for CartItem
/// </summary>
public class CartItemDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice => Quantity * UnitPrice;
    public DateTime AddedAt { get; set; }
}

/// <summary>
/// Data Transfer Object for Cart
/// </summary>
public class CartDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public List<CartItemDto> CartItems { get; set; } = new();
    public decimal TotalPrice => CartItems.Sum(item => item.TotalPrice);
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

/// <summary>
/// Add to Cart Request DTO
/// </summary>
public class AddToCartDto
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}

/// <summary>
/// Update Cart Item Request DTO
/// </summary>
public class UpdateCartItemDto
{
    public int Quantity { get; set; }
}
