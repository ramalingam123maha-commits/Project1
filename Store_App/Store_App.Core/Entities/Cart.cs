namespace Store_App.Core.Entities;

/// <summary>
/// Represents a shopping cart for a user
/// </summary>
public class Cart
{
    /// <summary>
    /// Unique identifier for the cart
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// User identifier who owns this cart
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// User reference
    /// </summary>
    public User? User { get; set; }

    /// <summary>
    /// List of items in the cart
    /// </summary>
    public List<CartItem> CartItems { get; set; } = new();

    /// <summary>
    /// Cart creation date
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Last update date
    /// </summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Calculate total price of cart
    /// </summary>
    public decimal GetTotalPrice()
    {
        return CartItems.Sum(item => item.Quantity * item.UnitPrice);
    }
}
