namespace Store_App.Core.Entities;

/// <summary>
/// Represents an item in an order
/// </summary>
public class OrderItem
{
    /// <summary>
    /// Unique identifier for order item
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Product identifier
    /// </summary>
    public int ProductId { get; set; }

    /// <summary>
    /// Product name (snapshot)
    /// </summary>
    public string ProductName { get; set; } = string.Empty;

    /// <summary>
    /// Quantity ordered
    /// </summary>
    public int Quantity { get; set; }

    /// <summary>
    /// Unit price at time of order
    /// </summary>
    public decimal UnitPrice { get; set; }

    /// <summary>
    /// Total price for this item (Quantity * UnitPrice)
    /// </summary>
    public decimal TotalPrice => Quantity * UnitPrice;
}
