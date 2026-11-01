namespace Store_App.Tests.Services;

using Xunit;
using Moq;
using Store_App.Core.DTOs;
using Store_App.Core.Entities;
using Store_App.Data.Repositories;
using Store_App.Services.Services;
using Store_App.Services.Exceptions;
using Microsoft.Extensions.Logging;

public class ProductServiceTests
{
    private readonly ProductService _productService;
    private readonly Mock<IRepository<Product>> _mockProductRepository;
    private readonly Mock<ILogger<ProductService>> _mockLogger;

    public ProductServiceTests()
    {
        _mockProductRepository = new Mock<IRepository<Product>>();
        _mockLogger = new Mock<ILogger<ProductService>>();
        _productService = new ProductService(_mockProductRepository.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task GetProductByIdAsync_WithValidId_ReturnsProductDto()
    {
        // Arrange
        var productId = 1;
        var product = new Product
        {
            Id = productId,
            Name = "Laptop",
            Description = "High-performance laptop",
            Price = 999.99m,
            StockQuantity = 50,
            Category = "Electronics"
        };
        _mockProductRepository.Setup(r => r.GetByIdAsync(productId)).ReturnsAsync(product);

        // Act
        var result = await _productService.GetProductByIdAsync(productId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(productId, result.Id);
        Assert.Equal("Laptop", result.Name);
        Assert.Equal(999.99m, result.Price);
    }

    [Fact]
    public async Task GetProductByIdAsync_WithInvalidId_ThrowsResourceNotFoundException()
    {
        // Arrange
        var productId = 999;
        _mockProductRepository.Setup(r => r.GetByIdAsync(productId)).ReturnsAsync((Product?)null);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ResourceNotFoundException>(() => _productService.GetProductByIdAsync(productId));
        Assert.Contains("not found", exception.Message);
    }

    [Fact]
    public async Task GetAllProductsAsync_ReturnsListOfProducts()
    {
        // Arrange
        var products = new List<Product>
        {
            new Product { Id = 1, Name = "Laptop", Price = 999.99m, StockQuantity = 50, Category = "Electronics" },
            new Product { Id = 2, Name = "Mouse", Price = 29.99m, StockQuantity = 200, Category = "Accessories" }
        };
        _mockProductRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(products);

        // Act
        var result = await _productService.GetAllProductsAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count);
    }

    [Fact]
    public async Task CreateProductAsync_WithValidData_ReturnsCreatedProductDto()
    {
        // Arrange
        var createProductDto = new CreateProductDto
        {
            Name = "Keyboard",
            Description = "Mechanical keyboard",
            Price = 79.99m,
            StockQuantity = 100,
            Category = "Accessories"
        };

        var createdProduct = new Product
        {
            Id = 1,
            Name = createProductDto.Name,
            Description = createProductDto.Description,
            Price = createProductDto.Price,
            StockQuantity = createProductDto.StockQuantity,
            Category = createProductDto.Category
        };

        _mockProductRepository.Setup(r => r.AddAsync(It.IsAny<Product>())).ReturnsAsync(createdProduct);

        // Act
        var result = await _productService.CreateProductAsync(createProductDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result.Id);
        Assert.Equal("Keyboard", result.Name);
        _mockProductRepository.Verify(r => r.AddAsync(It.IsAny<Product>()), Times.Once);
    }

    [Fact]
    public async Task CreateProductAsync_WithInvalidPrice_ThrowsValidationException()
    {
        // Arrange
        var createProductDto = new CreateProductDto
        {
            Name = "Product",
            Description = "Description",
            Price = -10m,
            StockQuantity = 100,
            Category = "Category"
        };

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ValidationException>(() => _productService.CreateProductAsync(createProductDto));
        Assert.Contains("Price must be greater than 0", exception.Details);
    }

    [Fact]
    public async Task UpdateProductAsync_WithValidData_ReturnsUpdatedProductDto()
    {
        // Arrange
        var productId = 1;
        var existingProduct = new Product
        {
            Id = productId,
            Name = "Old Name",
            Price = 100m,
            StockQuantity = 50,
            Category = "Old Category"
        };

        var updateProductDto = new UpdateProductDto
        {
            Name = "Updated Name",
            Description = "Updated Description",
            Price = 150m,
            StockQuantity = 75,
            Category = "New Category"
        };

        _mockProductRepository.Setup(r => r.GetByIdAsync(productId)).ReturnsAsync(existingProduct);
        _mockProductRepository.Setup(r => r.UpdateAsync(It.IsAny<Product>())).ReturnsAsync(existingProduct);

        // Act
        var result = await _productService.UpdateProductAsync(productId, updateProductDto);

        // Assert
        Assert.NotNull(result);
        _mockProductRepository.Verify(r => r.UpdateAsync(It.IsAny<Product>()), Times.Once);
    }

    [Fact]
    public async Task DeleteProductAsync_WithValidId_ReturnsTrue()
    {
        // Arrange
        var productId = 1;
        _mockProductRepository.Setup(r => r.ExistsAsync(productId)).ReturnsAsync(true);
        _mockProductRepository.Setup(r => r.DeleteAsync(productId)).ReturnsAsync(true);

        // Act
        var result = await _productService.DeleteProductAsync(productId);

        // Assert
        Assert.True(result);
        _mockProductRepository.Verify(r => r.DeleteAsync(productId), Times.Once);
    }

    [Fact]
    public async Task DeleteProductAsync_WithInvalidId_ThrowsResourceNotFoundException()
    {
        // Arrange
        var productId = 999;
        _mockProductRepository.Setup(r => r.ExistsAsync(productId)).ReturnsAsync(false);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ResourceNotFoundException>(() => _productService.DeleteProductAsync(productId));
        Assert.Contains("not found", exception.Message);
    }
}
