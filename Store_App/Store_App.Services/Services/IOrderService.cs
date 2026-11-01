namespace Store_App.Services.Services;

using Store_App.Core.DTOs;
using Store_App.Core.Entities;

/// <summary>
/// Interface for order service operations
/// </summary>
public interface IOrderService
{
    Task<OrderDto> GetOrderByIdAsync(int id);
    Task<List<OrderDto>> GetAllOrdersAsync();
    Task<List<OrderDto>> GetOrdersByUserIdAsync(int userId);
    Task<List<OrderDto>> GetOrdersByStatusAsync(OrderStatus status);
    Task<OrderDto> PlaceOrderAsync(PlaceOrderDto placeOrderDto);
    Task<OrderDto> UpdateOrderStatusAsync(int orderId, UpdateOrderStatusDto updateOrderStatusDto);
    Task<bool> CancelOrderAsync(int orderId);
}
