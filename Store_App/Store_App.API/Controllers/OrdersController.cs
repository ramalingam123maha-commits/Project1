namespace Store_App.API.Controllers;

using Microsoft.AspNetCore.Mvc;
using Store_App.Core.DTOs;
using Store_App.Core.Entities;
using Store_App.Services.Services;

/// <summary>
/// Order management API endpoints
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(IOrderService orderService, ILogger<OrdersController> logger)
    {
        _orderService = orderService;
        _logger = logger;
    }

    /// <summary>
    /// Get all orders
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<OrderDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAll()
    {
        _logger.LogInformation("GET /api/orders - Retrieving all orders");
        var orders = await _orderService.GetAllOrdersAsync();
        return Ok(ApiResponse<List<OrderDto>>.SuccessResponse(orders, "Orders retrieved successfully"));
    }

    /// <summary>
    /// Get order by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<OrderDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetById(int id)
    {
        _logger.LogInformation("GET /api/orders/{id} - Retrieving order {OrderId}", id);
        var order = await _orderService.GetOrderByIdAsync(id);
        return Ok(ApiResponse<OrderDto>.SuccessResponse(order, "Order retrieved successfully"));
    }

    /// <summary>
    /// Get orders for a specific user
    /// </summary>
    [HttpGet("user/{userId}")]
    [ProducesResponseType(typeof(ApiResponse<List<OrderDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetByUserId(int userId)
    {
        _logger.LogInformation("GET /api/orders/user/{userId} - Retrieving orders for user {UserId}", userId);
        var orders = await _orderService.GetOrdersByUserIdAsync(userId);
        return Ok(ApiResponse<List<OrderDto>>.SuccessResponse(orders, "Orders retrieved successfully"));
    }

    /// <summary>
    /// Get orders by status
    /// </summary>
    [HttpGet("status/{status}")]
    [ProducesResponseType(typeof(ApiResponse<List<OrderDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetByStatus(OrderStatus status)
    {
        _logger.LogInformation("GET /api/orders/status/{status} - Retrieving orders with status {Status}", status);
        var orders = await _orderService.GetOrdersByStatusAsync(status);
        return Ok(ApiResponse<List<OrderDto>>.SuccessResponse(orders, "Orders retrieved successfully"));
    }

    /// <summary>
    /// Place a new order from user's cart
    /// </summary>
    [HttpPost("place")]
    [ProducesResponseType(typeof(ApiResponse<OrderDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> PlaceOrder([FromBody] PlaceOrderDto placeOrderDto)
    {
        _logger.LogInformation("POST /api/orders/place - Placing order for user {UserId}", placeOrderDto.UserId);
        var order = await _orderService.PlaceOrderAsync(placeOrderDto);
        return CreatedAtAction(nameof(GetById), new { id = order.Id }, 
            ApiResponse<OrderDto>.SuccessResponse(order, "Order placed successfully"));
    }

    /// <summary>
    /// Update order status
    /// </summary>
    [HttpPut("{id}/status")]
    [ProducesResponseType(typeof(ApiResponse<OrderDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusDto updateOrderStatusDto)
    {
        _logger.LogInformation("PUT /api/orders/{id}/status - Updating order status {OrderId}", id);
        var order = await _orderService.UpdateOrderStatusAsync(id, updateOrderStatusDto);
        return Ok(ApiResponse<OrderDto>.SuccessResponse(order, "Order status updated successfully"));
    }

    /// <summary>
    /// Cancel an order
    /// </summary>
    [HttpPut("{id}/cancel")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> CancelOrder(int id)
    {
        _logger.LogInformation("PUT /api/orders/{id}/cancel - Cancelling order {OrderId}", id);
        var result = await _orderService.CancelOrderAsync(id);
        return Ok(ApiResponse.SuccessResponse("Order cancelled successfully"));
    }
}
