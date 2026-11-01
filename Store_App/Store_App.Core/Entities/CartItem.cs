namespace Store_App.Core.Entities;

/// <summary>
/// Represents an item in the shopping cart
/// </summary>
public class CartItem
{
    /// <summary>
    /// Unique identifier for cart item
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Product identifier
    /// </summary>
    public int ProductId { get; set; }

    /// <summary>
    /// Product details (reference)
    /// </summary>
    public Product? Product { get; set; }

    /// <summary>
    /// Quantity of product in cart
    /// </summary>
    public int Quantity { get; set; }

    /// <summary>
    /// Unit price at the time of adding to cart
    /// </summary>
    public decimal UnitPrice { get; set; }

    /// <summary>
    /// Item added to cart at
    /// </summary>
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
}
