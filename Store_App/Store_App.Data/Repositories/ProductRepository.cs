namespace Store_App.Data.Repositories;

using Store_App.Core.Entities;

/// <summary>
/// Product repository for data access operations
/// </summary>
public class ProductRepository : IRepository<Product>
{
    private readonly InMemoryDatabase _database;

    public ProductRepository(InMemoryDatabase database)
    {
        _database = database;
    }

    public Task<Product?> GetByIdAsync(int id)
    {
        var product = _database.Products.FirstOrDefault(p => p.Id == id);
        return Task.FromResult(product);
    }

    public Task<IEnumerable<Product>> GetAllAsync()
    {
        var products = _database.Products.AsEnumerable();
        return Task.FromResult(products);
    }

    public Task<Product> AddAsync(Product entity)
    {
        entity.Id = _database.GetNextProductId();
        entity.CreatedAt = DateTime.UtcNow;
        entity.UpdatedAt = DateTime.UtcNow;
        _database.Products.Add(entity);
        return Task.FromResult(entity);
    }

    public Task<Product> UpdateAsync(Product entity)
    {
        var existingProduct = _database.Products.FirstOrDefault(p => p.Id == entity.Id);
        if (existingProduct != null)
        {
            existingProduct.Name = entity.Name;
            existingProduct.Description = entity.Description;
            existingProduct.Price = entity.Price;
            existingProduct.StockQuantity = entity.StockQuantity;
            existingProduct.Category = entity.Category;
            existingProduct.UpdatedAt = DateTime.UtcNow;
        }
        return Task.FromResult(entity);
    }

    public Task<bool> DeleteAsync(int id)
    {
        var product = _database.Products.FirstOrDefault(p => p.Id == id);
        if (product != null)
        {
            _database.Products.Remove(product);
            return Task.FromResult(true);
        }
        return Task.FromResult(false);
    }

    public Task<bool> ExistsAsync(int id)
    {
        return Task.FromResult(_database.Products.Any(p => p.Id == id));
    }

    /// <summary>
    /// Find products by category
    /// </summary>
    public Task<IEnumerable<Product>> GetByCategory(string category)
    {
        var products = _database.Products
            .Where(p => p.Category.Equals(category, StringComparison.OrdinalIgnoreCase))
            .AsEnumerable();
        return Task.FromResult(products);
    }

    /// <summary>
    /// Check if product has sufficient stock
    /// </summary>
    public Task<bool> HasSufficientStockAsync(int productId, int quantity)
    {
        var product = _database.Products.FirstOrDefault(p => p.Id == productId);
        return Task.FromResult(product != null && product.StockQuantity >= quantity);
    }
}
