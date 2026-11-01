namespace Store_App.Services.Services;

using Store_App.Core.DTOs;
using Store_App.Core.Entities;
using Store_App.Data.Repositories;
using Store_App.Services.Exceptions;
using Microsoft.Extensions.Logging;

/// <summary>
/// Service for product-related operations
/// </summary>
public class ProductService : IProductService
{
    private readonly IRepository<Product> _productRepository;
    private readonly ILogger<ProductService> _logger;

    public ProductService(IRepository<Product> productRepository, ILogger<ProductService> logger)
    {
        _productRepository = productRepository;
        _logger = logger;
    }

    public async Task<ProductDto> GetProductByIdAsync(int id)
    {
        _logger.LogInformation($"Fetching product with ID: {id}");
        
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null)
        {
            _logger.LogWarning($"Product with ID {id} not found");
            throw new ResourceNotFoundException(nameof(Product), id);
        }

        return MapToDto(product);
    }

    public async Task<List<ProductDto>> GetAllProductsAsync()
    {
        _logger.LogInformation("Fetching all products");
        
        var products = await _productRepository.GetAllAsync();
        return products.Select(MapToDto).ToList();
    }

    public async Task<List<ProductDto>> GetProductsByCategoryAsync(string category)
    {
        _logger.LogInformation($"Fetching products in category: {category}");
        
        var repository = (ProductRepository)_productRepository;
        var products = await repository.GetByCategory(category);
        return products.Select(MapToDto).ToList();
    }

    public async Task<ProductDto> CreateProductAsync(CreateProductDto createProductDto)
    {
        _logger.LogInformation($"Creating new product: {createProductDto.Name}");
        
        ValidateProductDto(createProductDto);

        var product = new Product
        {
            Name = createProductDto.Name,
            Description = createProductDto.Description,
            Price = createProductDto.Price,
            StockQuantity = createProductDto.StockQuantity,
            Category = createProductDto.Category
        };

        var createdProduct = await _productRepository.AddAsync(product);
        _logger.LogInformation($"Product created successfully with ID: {createdProduct.Id}");

        return MapToDto(createdProduct);
    }

    public async Task<ProductDto> UpdateProductAsync(int id, UpdateProductDto updateProductDto)
    {
        _logger.LogInformation($"Updating product with ID: {id}");
        
        ValidateProductDto(updateProductDto);

        var product = await _productRepository.GetByIdAsync(id);
        if (product == null)
        {
            _logger.LogWarning($"Product with ID {id} not found for update");
            throw new ResourceNotFoundException(nameof(Product), id);
        }

        product.Name = updateProductDto.Name;
        product.Description = updateProductDto.Description;
        product.Price = updateProductDto.Price;
        product.StockQuantity = updateProductDto.StockQuantity;
        product.Category = updateProductDto.Category;
        product.UpdatedAt = DateTime.UtcNow;

        var updatedProduct = await _productRepository.UpdateAsync(product);
        _logger.LogInformation($"Product with ID {id} updated successfully");

        return MapToDto(updatedProduct);
    }

    public async Task<bool> DeleteProductAsync(int id)
    {
        _logger.LogInformation($"Deleting product with ID: {id}");
        
        var exists = await _productRepository.ExistsAsync(id);
        if (!exists)
        {
            _logger.LogWarning($"Product with ID {id} not found for deletion");
            throw new ResourceNotFoundException(nameof(Product), id);
        }

        var result = await _productRepository.DeleteAsync(id);
        _logger.LogInformation($"Product with ID {id} deleted successfully");

        return result;
    }

    public async Task<bool> HasSufficientStockAsync(int productId, int quantity)
    {
        var repository = (ProductRepository)_productRepository;
        return await repository.HasSufficientStockAsync(productId, quantity);
    }

    private void ValidateProductDto(CreateProductDto createProductDto)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(createProductDto.Name))
            errors.Add("Name is required");

        if (createProductDto.Price <= 0)
            errors.Add("Price must be greater than 0");

        if (createProductDto.StockQuantity < 0)
            errors.Add("Stock quantity cannot be negative");

        if (string.IsNullOrWhiteSpace(createProductDto.Category))
            errors.Add("Category is required");

        if (errors.Any())
            throw new ValidationException("Product validation failed", errors);
    }

    private void ValidateProductDto(UpdateProductDto updateProductDto)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(updateProductDto.Name))
            errors.Add("Name is required");

        if (updateProductDto.Price <= 0)
            errors.Add("Price must be greater than 0");

        if (updateProductDto.StockQuantity < 0)
            errors.Add("Stock quantity cannot be negative");

        if (string.IsNullOrWhiteSpace(updateProductDto.Category))
            errors.Add("Category is required");

        if (errors.Any())
            throw new ValidationException("Product validation failed", errors);
    }

    private static ProductDto MapToDto(Product product)
    {
        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            Category = product.Category,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt
        };
    }
}
