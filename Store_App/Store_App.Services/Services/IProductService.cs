namespace Store_App.Services.Services;

using Store_App.Core.DTOs;

/// <summary>
/// Interface for product service operations
/// </summary>
public interface IProductService
{
    Task<ProductDto> GetProductByIdAsync(int id);
    Task<List<ProductDto>> GetAllProductsAsync();
    Task<List<ProductDto>> GetProductsByCategoryAsync(string category);
    Task<ProductDto> CreateProductAsync(CreateProductDto createProductDto);
    Task<ProductDto> UpdateProductAsync(int id, UpdateProductDto updateProductDto);
    Task<bool> DeleteProductAsync(int id);
    Task<bool> HasSufficientStockAsync(int productId, int quantity);
}
