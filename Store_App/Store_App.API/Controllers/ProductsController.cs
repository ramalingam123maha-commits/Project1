namespace Store_App.API.Controllers;

using Microsoft.AspNetCore.Mvc;
using Store_App.Core.DTOs;
using Store_App.Services.Services;

/// <summary>
/// Product catalog API endpoints
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(IProductService productService, ILogger<ProductsController> logger)
    {
        _productService = productService;
        _logger = logger;
    }

    /// <summary>
    /// Get all products
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<ProductDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAll()
    {
        _logger.LogInformation("GET /api/products - Retrieving all products");
        var products = await _productService.GetAllProductsAsync();
        return Ok(ApiResponse<List<ProductDto>>.SuccessResponse(products, "Products retrieved successfully"));
    }

    /// <summary>
    /// Get product by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<ProductDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetById(int id)
    {
        _logger.LogInformation("GET /api/products/{id} - Retrieving product {ProductId}", id);
        var product = await _productService.GetProductByIdAsync(id);
        return Ok(ApiResponse<ProductDto>.SuccessResponse(product, "Product retrieved successfully"));
    }

    /// <summary>
    /// Get products by category
    /// </summary>
    [HttpGet("category/{category}")]
    [ProducesResponseType(typeof(ApiResponse<List<ProductDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetByCategory(string category)
    {
        _logger.LogInformation("GET /api/products/category/{category} - Retrieving products in category {Category}", category);
        var products = await _productService.GetProductsByCategoryAsync(category);
        return Ok(ApiResponse<List<ProductDto>>.SuccessResponse(products, "Products retrieved successfully"));
    }

    /// <summary>
    /// Create a new product
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<ProductDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Create([FromBody] CreateProductDto createProductDto)
    {
        _logger.LogInformation("POST /api/products - Creating new product {ProductName}", createProductDto.Name);
        var product = await _productService.CreateProductAsync(createProductDto);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, 
            ApiResponse<ProductDto>.SuccessResponse(product, "Product created successfully"));
    }

    /// <summary>
    /// Update an existing product
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(ApiResponse<ProductDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateProductDto updateProductDto)
    {
        _logger.LogInformation("PUT /api/products/{id} - Updating product {ProductId}", id);
        var product = await _productService.UpdateProductAsync(id, updateProductDto);
        return Ok(ApiResponse<ProductDto>.SuccessResponse(product, "Product updated successfully"));
    }

    /// <summary>
    /// Delete a product
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Delete(int id)
    {
        _logger.LogInformation("DELETE /api/products/{id} - Deleting product {ProductId}", id);
        var result = await _productService.DeleteProductAsync(id);
        return Ok(ApiResponse.SuccessResponse("Product deleted successfully"));
    }
}
