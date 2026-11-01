namespace Store_App.Core.Entities;

/// <summary>
/// Represents an order placed by a user
/// </summary>
public class Order
{
    /// <summary>
    /// Unique identifier for the order
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// User identifier who placed this order
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// User reference
    /// </summary>
    public User? User { get; set; }

    /// <summary>
    /// Order items
    /// </summary>
    public List<OrderItem> OrderItems { get; set; } = new();

    /// <summary>
    /// Total amount for the order
    /// </summary>
    public decimal TotalAmount { get; set; }

    /// <summary>
    /// Order status (Pending, Processing, Shipped, Delivered, Cancelled)
    /// </summary>
    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    /// <summary>
    /// Order placement date
    /// </summary>
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Order modification date
    /// </summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// Order status enumeration
/// </summary>
public enum OrderStatus
{
    Pending = 0,
    Processing = 1,
    Shipped = 2,
    Delivered = 3,
    Cancelled = 4
}
