namespace Store_App.Data;

using Store_App.Core.Entities;

/// <summary>
/// In-memory database context for the e-commerce system
/// </summary>
public class InMemoryDatabase
{
    private static InMemoryDatabase? _instance;
    private static readonly object _lock = new();

    // Collections for entities
    public List<User> Users { get; set; } = new();
    public List<Product> Products { get; set; } = new();
    public List<Cart> Carts { get; set; } = new();
    public List<Order> Orders { get; set; } = new();

    // Auto-increment IDs
    private int _userId = 1;
    private int _productId = 1;
    private int _cartId = 1;
    private int _orderId = 1;
    private int _cartItemId = 1;
    private int _orderItemId = 1;

    /// <summary>
    /// Singleton pattern implementation
    /// </summary>
    public static InMemoryDatabase GetInstance()
    {
        if (_instance == null)
        {
            lock (_lock)
            {
                _instance ??= new InMemoryDatabase();
                _instance.InitializeDefaultData();
            }
        }
        return _instance;
    }

    /// <summary>
    /// Get next user ID
    /// </summary>
    public int GetNextUserId()
    {
        return Interlocked.Increment(ref _userId);
    }

    /// <summary>
    /// Get next product ID
    /// </summary>
    public int GetNextProductId()
    {
        return Interlocked.Increment(ref _productId);
    }

    /// <summary>
    /// Get next cart ID
    /// </summary>
    public int GetNextCartId()
    {
        return Interlocked.Increment(ref _cartId);
    }

    /// <summary>
    /// Get next order ID
    /// </summary>
    public int GetNextOrderId()
    {
        return Interlocked.Increment(ref _orderId);
    }

    /// <summary>
    /// Get next cart item ID
    /// </summary>
    public int GetNextCartItemId()
    {
        return Interlocked.Increment(ref _cartItemId);
    }

    /// <summary>
    /// Get next order item ID
    /// </summary>
    public int GetNextOrderItemId()
    {
        return Interlocked.Increment(ref _orderItemId);
    }

    /// <summary>
    /// Initialize with default sample data
    /// </summary>
    private void InitializeDefaultData()
    {
        // Add sample users
        Users.Add(new User { Id = GetNextUserId(), Name = "John Doe", Email = "john@example.com", PhoneNumber = "555-0001" });
        Users.Add(new User { Id = GetNextUserId(), Name = "Jane Smith", Email = "jane@example.com", PhoneNumber = "555-0002" });
        Users.Add(new User { Id = GetNextUserId(), Name = "Bob Johnson", Email = "bob@example.com", PhoneNumber = "555-0003" });

        // Add sample products
        Products.Add(new Product 
        { 
            Id = GetNextProductId(), 
            Name = "Laptop", 
            Description = "High-performance laptop",
            Price = 999.99m, 
            StockQuantity = 50, 
            Category = "Electronics" 
        });
        
        Products.Add(new Product 
        { 
            Id = GetNextProductId(), 
            Name = "Mouse", 
            Description = "Wireless mouse",
            Price = 29.99m, 
            StockQuantity = 200, 
            Category = "Accessories" 
        });
        
        Products.Add(new Product 
        { 
            Id = GetNextProductId(), 
            Name = "Keyboard", 
            Description = "Mechanical keyboard",
            Price = 79.99m, 
            StockQuantity = 100, 
            Category = "Accessories" 
        });
        
        Products.Add(new Product 
        { 
            Id = GetNextProductId(), 
            Name = "Monitor", 
            Description = "4K display monitor",
            Price = 399.99m, 
            StockQuantity = 30, 
            Category = "Electronics" 
        });

        // Create carts for each user
        foreach (var user in Users)
        {
            var cart = new Cart 
            { 
                Id = GetNextCartId(), 
                UserId = user.Id, 
                User = user 
            };
            Carts.Add(cart);
        }
    }
}
