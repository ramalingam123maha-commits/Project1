namespace Store_App.Data.Repositories;

using Store_App.Core.Entities;

/// <summary>
/// Cart repository for data access operations
/// </summary>
public class CartRepository : IRepository<Cart>
{
    private readonly InMemoryDatabase _database;

    public CartRepository(InMemoryDatabase database)
    {
        _database = database;
    }

    public Task<Cart?> GetByIdAsync(int id)
    {
        var cart = _database.Carts.FirstOrDefault(c => c.Id == id);
        return Task.FromResult(cart);
    }

    public Task<IEnumerable<Cart>> GetAllAsync()
    {
        var carts = _database.Carts.AsEnumerable();
        return Task.FromResult(carts);
    }

    public Task<Cart> AddAsync(Cart entity)
    {
        entity.Id = _database.GetNextCartId();
        entity.CreatedAt = DateTime.UtcNow;
        entity.UpdatedAt = DateTime.UtcNow;
        _database.Carts.Add(entity);
        return Task.FromResult(entity);
    }

    public Task<Cart> UpdateAsync(Cart entity)
    {
        var existingCart = _database.Carts.FirstOrDefault(c => c.Id == entity.Id);
        if (existingCart != null)
        {
            existingCart.CartItems = entity.CartItems;
            existingCart.UpdatedAt = DateTime.UtcNow;
        }
        return Task.FromResult(entity);
    }

    public Task<bool> DeleteAsync(int id)
    {
        var cart = _database.Carts.FirstOrDefault(c => c.Id == id);
        if (cart != null)
        {
            _database.Carts.Remove(cart);
            return Task.FromResult(true);
        }
        return Task.FromResult(false);
    }

    public Task<bool> ExistsAsync(int id)
    {
        return Task.FromResult(_database.Carts.Any(c => c.Id == id));
    }

    /// <summary>
    /// Get cart by user ID
    /// </summary>
    public Task<Cart?> GetByUserIdAsync(int userId)
    {
        var cart = _database.Carts.FirstOrDefault(c => c.UserId == userId);
        return Task.FromResult(cart);
    }

    /// <summary>
    /// Add item to cart
    /// </summary>
    public Task<CartItem> AddCartItemAsync(int cartId, CartItem item)
    {
        var cart = _database.Carts.FirstOrDefault(c => c.Id == cartId);
        if (cart != null)
        {
            item.Id = _database.GetNextCartItemId();
            item.AddedAt = DateTime.UtcNow;
            cart.CartItems.Add(item);
            cart.UpdatedAt = DateTime.UtcNow;
        }
        return Task.FromResult(item);
    }

    /// <summary>
    /// Remove item from cart
    /// </summary>
    public Task<bool> RemoveCartItemAsync(int cartId, int cartItemId)
    {
        var cart = _database.Carts.FirstOrDefault(c => c.Id == cartId);
        if (cart != null)
        {
            var item = cart.CartItems.FirstOrDefault(ci => ci.Id == cartItemId);
            if (item != null)
            {
                cart.CartItems.Remove(item);
                cart.UpdatedAt = DateTime.UtcNow;
                return Task.FromResult(true);
            }
        }
        return Task.FromResult(false);
    }

    /// <summary>
    /// Clear all items from cart
    /// </summary>
    public Task<bool> ClearCartAsync(int cartId)
    {
        var cart = _database.Carts.FirstOrDefault(c => c.Id == cartId);
        if (cart != null)
        {
            cart.CartItems.Clear();
            cart.UpdatedAt = DateTime.UtcNow;
            return Task.FromResult(true);
        }
        return Task.FromResult(false);
    }
}
