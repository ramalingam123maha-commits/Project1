namespace Store_App.Data.Repositories;

using Store_App.Core.Entities;

/// <summary>
/// Order repository for data access operations
/// </summary>
public class OrderRepository : IRepository<Order>
{
    private readonly InMemoryDatabase _database;

    public OrderRepository(InMemoryDatabase database)
    {
        _database = database;
    }

    public Task<Order?> GetByIdAsync(int id)
    {
        var order = _database.Orders.FirstOrDefault(o => o.Id == id);
        return Task.FromResult(order);
    }

    public Task<IEnumerable<Order>> GetAllAsync()
    {
        var orders = _database.Orders.AsEnumerable();
        return Task.FromResult(orders);
    }

    public Task<Order> AddAsync(Order entity)
    {
        entity.Id = _database.GetNextOrderId();
        entity.OrderDate = DateTime.UtcNow;
        entity.UpdatedAt = DateTime.UtcNow;
        
        // Assign IDs to order items
        foreach (var item in entity.OrderItems)
        {
            item.Id = _database.GetNextOrderItemId();
        }
        
        _database.Orders.Add(entity);
        return Task.FromResult(entity);
    }

    public Task<Order> UpdateAsync(Order entity)
    {
        var existingOrder = _database.Orders.FirstOrDefault(o => o.Id == entity.Id);
        if (existingOrder != null)
        {
            existingOrder.Status = entity.Status;
            existingOrder.TotalAmount = entity.TotalAmount;
            existingOrder.UpdatedAt = DateTime.UtcNow;
        }
        return Task.FromResult(entity);
    }

    public Task<bool> DeleteAsync(int id)
    {
        var order = _database.Orders.FirstOrDefault(o => o.Id == id);
        if (order != null)
        {
            _database.Orders.Remove(order);
            return Task.FromResult(true);
        }
        return Task.FromResult(false);
    }

    public Task<bool> ExistsAsync(int id)
    {
        return Task.FromResult(_database.Orders.Any(o => o.Id == id));
    }

    /// <summary>
    /// Get orders by user ID
    /// </summary>
    public Task<IEnumerable<Order>> GetByUserIdAsync(int userId)
    {
        var orders = _database.Orders
            .Where(o => o.UserId == userId)
            .AsEnumerable();
        return Task.FromResult(orders);
    }

    /// <summary>
    /// Get orders by status
    /// </summary>
    public Task<IEnumerable<Order>> GetByStatusAsync(OrderStatus status)
    {
        var orders = _database.Orders
            .Where(o => o.Status == status)
            .AsEnumerable();
        return Task.FromResult(orders);
    }

    /// <summary>
    /// Update order status
    /// </summary>
    public Task<bool> UpdateOrderStatusAsync(int orderId, OrderStatus status)
    {
        var order = _database.Orders.FirstOrDefault(o => o.Id == orderId);
        if (order != null)
        {
            order.Status = status;
            order.UpdatedAt = DateTime.UtcNow;
            return Task.FromResult(true);
        }
        return Task.FromResult(false);
    }
}
