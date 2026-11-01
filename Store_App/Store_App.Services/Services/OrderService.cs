namespace Store_App.Services.Services;

using Store_App.Core.DTOs;
using Store_App.Core.Entities;
using Store_App.Data.Repositories;
using Store_App.Services.Exceptions;
using Microsoft.Extensions.Logging;

/// <summary>
/// Service for order-related operations
/// </summary>
public class OrderService : IOrderService
{
    private readonly OrderRepository _orderRepository;
    private readonly CartRepository _cartRepository;
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<Product> _productRepository;
    private readonly ILogger<OrderService> _logger;

    public OrderService(
        OrderRepository orderRepository,
        CartRepository cartRepository,
        IRepository<User> userRepository,
        IRepository<Product> productRepository,
        ILogger<OrderService> logger)
    {
        _orderRepository = orderRepository;
        _cartRepository = cartRepository;
        _userRepository = userRepository;
        _productRepository = productRepository;
        _logger = logger;
    }

    public async Task<OrderDto> GetOrderByIdAsync(int id)
    {
        _logger.LogInformation($"Fetching order with ID: {id}");
        
        var order = await _orderRepository.GetByIdAsync(id);
        if (order == null)
        {
            _logger.LogWarning($"Order with ID {id} not found");
            throw new ResourceNotFoundException(nameof(Order), id);
        }

        return MapToDto(order);
    }

    public async Task<List<OrderDto>> GetAllOrdersAsync()
    {
        _logger.LogInformation("Fetching all orders");
        
        var orders = await _orderRepository.GetAllAsync();
        return orders.Select(MapToDto).ToList();
    }

    public async Task<List<OrderDto>> GetOrdersByUserIdAsync(int userId)
    {
        _logger.LogInformation($"Fetching orders for user ID: {userId}");
        
        var orders = await _orderRepository.GetByUserIdAsync(userId);
        return orders.Select(MapToDto).ToList();
    }

    public async Task<List<OrderDto>> GetOrdersByStatusAsync(OrderStatus status)
    {
        _logger.LogInformation($"Fetching orders with status: {status}");
        
        var orders = await _orderRepository.GetByStatusAsync(status);
        return orders.Select(MapToDto).ToList();
    }

    public async Task<OrderDto> PlaceOrderAsync(PlaceOrderDto placeOrderDto)
    {
        _logger.LogInformation($"Placing order for user ID: {placeOrderDto.UserId}");
        
        // Validate user exists
        var userExists = await _userRepository.ExistsAsync(placeOrderDto.UserId);
        if (!userExists)
        {
            _logger.LogWarning($"User {placeOrderDto.UserId} not found");
            throw new ResourceNotFoundException(nameof(User), placeOrderDto.UserId);
        }

        // Get user's cart
        var cart = await _cartRepository.GetByUserIdAsync(placeOrderDto.UserId);
        if (cart == null)
        {
            _logger.LogWarning($"Cart for user {placeOrderDto.UserId} not found");
            throw new ResourceNotFoundException(nameof(Cart), placeOrderDto.UserId);
        }

        // Check if cart is empty
        if (!cart.CartItems.Any())
        {
            _logger.LogWarning($"Cannot place order with empty cart");
            throw new BusinessRuleException("Cart is empty. Please add items before placing order", "EMPTY_CART");
        }

        // Create order items from cart items
        var orderItems = new List<OrderItem>();
        decimal totalAmount = 0;

        foreach (var cartItem in cart.CartItems)
        {
            var orderItem = new OrderItem
            {
                ProductId = cartItem.ProductId,
                ProductName = cartItem.Product?.Name ?? "Unknown",
                Quantity = cartItem.Quantity,
                UnitPrice = cartItem.UnitPrice
            };

            orderItems.Add(orderItem);
            totalAmount += orderItem.TotalPrice;
        }

        // Create order
        var order = new Order
        {
            UserId = placeOrderDto.UserId,
            OrderItems = orderItems,
            TotalAmount = totalAmount,
            Status = OrderStatus.Pending
        };

        var createdOrder = await _orderRepository.AddAsync(order);
        _logger.LogInformation($"Order created successfully with ID: {createdOrder.Id}");

        // Clear cart
        await _cartRepository.ClearCartAsync(cart.Id);
        _logger.LogInformation($"Cart cleared after order placement");

        return MapToDto(createdOrder);
    }

    public async Task<OrderDto> UpdateOrderStatusAsync(int orderId, UpdateOrderStatusDto updateOrderStatusDto)
    {
        _logger.LogInformation($"Updating order {orderId} status to {updateOrderStatusDto.Status}");
        
        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order == null)
        {
            _logger.LogWarning($"Order with ID {orderId} not found");
            throw new ResourceNotFoundException(nameof(Order), orderId);
        }

        order.Status = updateOrderStatusDto.Status;
        order.UpdatedAt = DateTime.UtcNow;

        var updatedOrder = await _orderRepository.UpdateAsync(order);
        _logger.LogInformation($"Order {orderId} status updated to {updateOrderStatusDto.Status}");

        return MapToDto(updatedOrder);
    }

    public async Task<bool> CancelOrderAsync(int orderId)
    {
        _logger.LogInformation($"Cancelling order with ID: {orderId}");
        
        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order == null)
        {
            _logger.LogWarning($"Order with ID {orderId} not found");
            throw new ResourceNotFoundException(nameof(Order), orderId);
        }

        if (order.Status == OrderStatus.Delivered || order.Status == OrderStatus.Cancelled)
        {
            _logger.LogWarning($"Cannot cancel order {orderId} with status {order.Status}");
            throw new BusinessRuleException($"Cannot cancel order with status {order.Status}", "CANNOT_CANCEL_ORDER");
        }

        order.Status = OrderStatus.Cancelled;
        order.UpdatedAt = DateTime.UtcNow;

        await _orderRepository.UpdateAsync(order);
        _logger.LogInformation($"Order {orderId} cancelled successfully");

        return true;
    }

    private static OrderDto MapToDto(Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            UserId = order.UserId,
            OrderItems = order.OrderItems.Select(oi => new OrderItemDto
            {
                Id = oi.Id,
                ProductId = oi.ProductId,
                ProductName = oi.ProductName,
                Quantity = oi.Quantity,
                UnitPrice = oi.UnitPrice
            }).ToList(),
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            OrderDate = order.OrderDate,
            UpdatedAt = order.UpdatedAt
        };
    }
}
