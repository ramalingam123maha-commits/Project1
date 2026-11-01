namespace Store_App.Core.DTOs;

using Store_App.Core.Entities;

/// <summary>
/// Data Transfer Object for OrderItem
/// </summary>
public class OrderItemDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice => Quantity * UnitPrice;
}

/// <summary>
/// Data Transfer Object for Order
/// </summary>
public class OrderDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public List<OrderItemDto> OrderItems { get; set; } = new();
    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; }
    public DateTime OrderDate { get; set; }
    public DateTime UpdatedAt { get; set; }
}

/// <summary>
/// Place Order Request DTO
/// </summary>
public class PlaceOrderDto
{
    public int UserId { get; set; }
}

/// <summary>
/// Update Order Status Request DTO
/// </summary>
public class UpdateOrderStatusDto
{
    public OrderStatus Status { get; set; }
}
