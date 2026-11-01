namespace Store_App.Tests.Services;

using Xunit;
using Moq;
using Store_App.Core.DTOs;
using Store_App.Core.Entities;
using Store_App.Data;
using Store_App.Data.Repositories;
using Store_App.Services.Services;
using Store_App.Services.Exceptions;
using Microsoft.Extensions.Logging;

public class OrderServiceTests
{
    private readonly OrderService _orderService;
    private readonly Mock<OrderRepository> _mockOrderRepository;
    private readonly Mock<CartRepository> _mockCartRepository;
    private readonly Mock<IRepository<User>> _mockUserRepository;
    private readonly Mock<IRepository<Product>> _mockProductRepository;
    private readonly Mock<ILogger<OrderService>> _mockLogger;

    public OrderServiceTests()
    {
        _mockOrderRepository = new Mock<OrderRepository>(new InMemoryDatabase());
        _mockCartRepository = new Mock<CartRepository>(new InMemoryDatabase());
        _mockUserRepository = new Mock<IRepository<User>>();
        _mockProductRepository = new Mock<IRepository<Product>>();
        _mockLogger = new Mock<ILogger<OrderService>>();
        
        _orderService = new OrderService(
            _mockOrderRepository.Object,
            _mockCartRepository.Object,
            _mockUserRepository.Object,
            _mockProductRepository.Object,
            _mockLogger.Object);
    }

    [Fact]
    public async Task GetOrderByIdAsync_WithValidId_ReturnsOrderDto()
    {
        // Arrange
        var orderId = 1;
        var order = new Order
        {
            Id = orderId,
            UserId = 1,
            TotalAmount = 100m,
            Status = OrderStatus.Pending,
            OrderItems = new List<OrderItem>()
        };
        
        _mockOrderRepository.Setup(r => r.GetByIdAsync(orderId)).ReturnsAsync(order);

        // Act
        var result = await _orderService.GetOrderByIdAsync(orderId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(orderId, result.Id);
        Assert.Equal(100m, result.TotalAmount);
    }

    [Fact]
    public async Task GetOrderByIdAsync_WithInvalidId_ThrowsResourceNotFoundException()
    {
        // Arrange
        var orderId = 999;
        _mockOrderRepository.Setup(r => r.GetByIdAsync(orderId)).ReturnsAsync((Order?)null);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ResourceNotFoundException>(() => _orderService.GetOrderByIdAsync(orderId));
        Assert.Contains("not found", exception.Message);
    }

    [Fact]
    public async Task GetAllOrdersAsync_ReturnsListOfOrders()
    {
        // Arrange
        var orders = new List<Order>
        {
            new Order { Id = 1, UserId = 1, TotalAmount = 100m, Status = OrderStatus.Pending, OrderItems = new List<OrderItem>() },
            new Order { Id = 2, UserId = 2, TotalAmount = 200m, Status = OrderStatus.Processing, OrderItems = new List<OrderItem>() }
        };
        
        _mockOrderRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(orders);

        // Act
        var result = await _orderService.GetAllOrdersAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count);
    }

    [Fact]
    public async Task GetOrdersByUserIdAsync_WithValidUserId_ReturnsUserOrders()
    {
        // Arrange
        var userId = 1;
        var orders = new List<Order>
        {
            new Order { Id = 1, UserId = userId, TotalAmount = 100m, Status = OrderStatus.Pending, OrderItems = new List<OrderItem>() },
            new Order { Id = 2, UserId = userId, TotalAmount = 200m, Status = OrderStatus.Processing, OrderItems = new List<OrderItem>() }
        };
        
        _mockOrderRepository.Setup(r => r.GetByUserIdAsync(userId)).ReturnsAsync(orders);

        // Act
        var result = await _orderService.GetOrdersByUserIdAsync(userId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count);
        Assert.All(result, o => Assert.Equal(userId, o.UserId));
    }

    [Fact]
    public async Task PlaceOrderAsync_WithValidUserAndCart_CreatesOrder()
    {
        // Arrange
        var userId = 1;
        var cartItems = new List<CartItem>
        {
            new CartItem { ProductId = 1, Quantity = 2, UnitPrice = 50m }
        };

        var cart = new Cart { Id = 1, UserId = userId, CartItems = cartItems };
        var user = new User { Id = userId, Name = "Test User", Email = "test@example.com" };

        var placeOrderDto = new PlaceOrderDto { UserId = userId };

        var createdOrder = new Order
        {
            Id = 1,
            UserId = userId,
            TotalAmount = 100m,
            Status = OrderStatus.Pending,
            OrderItems = new List<OrderItem> { new OrderItem { ProductId = 1, Quantity = 2, UnitPrice = 50m } }
        };

        _mockUserRepository.Setup(r => r.ExistsAsync(userId)).ReturnsAsync(true);
        _mockCartRepository.Setup(r => r.GetByUserIdAsync(userId)).ReturnsAsync(cart);
        _mockOrderRepository.Setup(r => r.AddAsync(It.IsAny<Order>())).ReturnsAsync(createdOrder);
        _mockCartRepository.Setup(r => r.ClearCartAsync(cart.Id)).ReturnsAsync(true);

        // Act
        var result = await _orderService.PlaceOrderAsync(placeOrderDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(userId, result.UserId);
        Assert.Equal(100m, result.TotalAmount);
        _mockOrderRepository.Verify(r => r.AddAsync(It.IsAny<Order>()), Times.Once);
    }

    [Fact]
    public async Task PlaceOrderAsync_WithInvalidUser_ThrowsResourceNotFoundException()
    {
        // Arrange
        var userId = 999;
        var placeOrderDto = new PlaceOrderDto { UserId = userId };

        _mockUserRepository.Setup(r => r.ExistsAsync(userId)).ReturnsAsync(false);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ResourceNotFoundException>(() => _orderService.PlaceOrderAsync(placeOrderDto));
        Assert.Contains("not found", exception.Message);
    }

    [Fact]
    public async Task PlaceOrderAsync_WithEmptyCart_ThrowsBusinessRuleException()
    {
        // Arrange
        var userId = 1;
        var cart = new Cart { Id = 1, UserId = userId, CartItems = new List<CartItem>() };
        var placeOrderDto = new PlaceOrderDto { UserId = userId };

        _mockUserRepository.Setup(r => r.ExistsAsync(userId)).ReturnsAsync(true);
        _mockCartRepository.Setup(r => r.GetByUserIdAsync(userId)).ReturnsAsync(cart);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<BusinessRuleException>(() => _orderService.PlaceOrderAsync(placeOrderDto));
        Assert.Contains("empty", exception.Message, System.StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task UpdateOrderStatusAsync_WithValidStatus_UpdatesSuccessfully()
    {
        // Arrange
        var orderId = 1;
        var order = new Order { Id = orderId, UserId = 1, TotalAmount = 100m, Status = OrderStatus.Pending, OrderItems = new List<OrderItem>() };
        var updateOrderStatusDto = new UpdateOrderStatusDto { Status = OrderStatus.Processing };

        _mockOrderRepository.Setup(r => r.GetByIdAsync(orderId)).ReturnsAsync(order);
        _mockOrderRepository.Setup(r => r.UpdateAsync(It.IsAny<Order>())).ReturnsAsync(order);

        // Act
        var result = await _orderService.UpdateOrderStatusAsync(orderId, updateOrderStatusDto);

        // Assert
        Assert.NotNull(result);
        _mockOrderRepository.Verify(r => r.UpdateAsync(It.IsAny<Order>()), Times.Once);
    }

    [Fact]
    public async Task CancelOrderAsync_WithPendingOrder_CancelsSuccessfully()
    {
        // Arrange
        var orderId = 1;
        var order = new Order { Id = orderId, UserId = 1, TotalAmount = 100m, Status = OrderStatus.Pending, OrderItems = new List<OrderItem>() };

        _mockOrderRepository.Setup(r => r.GetByIdAsync(orderId)).ReturnsAsync(order);
        _mockOrderRepository.Setup(r => r.UpdateAsync(It.IsAny<Order>())).ReturnsAsync(order);

        // Act
        var result = await _orderService.CancelOrderAsync(orderId);

        // Assert
        Assert.True(result);
        _mockOrderRepository.Verify(r => r.UpdateAsync(It.IsAny<Order>()), Times.Once);
    }

    [Fact]
    public async Task CancelOrderAsync_WithDeliveredOrder_ThrowsBusinessRuleException()
    {
        // Arrange
        var orderId = 1;
        var order = new Order { Id = orderId, UserId = 1, TotalAmount = 100m, Status = OrderStatus.Delivered, OrderItems = new List<OrderItem>() };

        _mockOrderRepository.Setup(r => r.GetByIdAsync(orderId)).ReturnsAsync(order);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<BusinessRuleException>(() => _orderService.CancelOrderAsync(orderId));
        Assert.Contains("Cannot cancel", exception.Message);
    }
}
