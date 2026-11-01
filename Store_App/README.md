# Store App - E-Commerce Web API

A comprehensive .NET 8 ASP.NET Core Web API for an e-commerce system with a clean architecture design, following SOLID principles and industry best practices.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Database](#database)
- [Testing](#testing)
- [Exception Handling](#exception-handling)
- [Logging](#logging)

## 🎯 Project Overview

Store App is a fully-featured e-commerce API that manages:

- **User Management**: Create, read, update, and delete user profiles
- **Product Catalog**: Manage product inventory with categories
- **Shopping Cart**: Add/remove products from cart with quantity management
- **Order Management**: Place orders, track order status, and manage order history

## 🏗️ Architecture

The project follows **Clean Architecture** principles with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│        Store_App.API                    │
│   (Controllers, Middleware, Routes)     │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│      Store_App.Services                 │
│   (Business Logic, Validation)          │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│    Store_App.Data & Store_App.Core      │
│  (Repositories, Entities, DTOs)         │
└─────────────────────────────────────────┘
```

### Layer Responsibilities

1. **API Layer**: HTTP request handling, routing, and response serialization
2. **Service Layer**: Business logic, validation, and orchestration
3. **Data Layer**: Data access, repository pattern, and persistence
4. **Core Layer**: Entity definitions, DTOs, and domain models

## 📁 Project Structure

```
Store_App/
├── Store_App.API/
│   ├── Controllers/
│   │   ├── UsersController.cs
│   │   ├── ProductsController.cs
│   │   ├── CartsController.cs
│   │   └── OrdersController.cs
│   ├── Middleware/
│   │   └── ExceptionHandlingMiddleware.cs
│   ├── Program.cs
│   ├── appsettings.json
│   └── Store_App.API.csproj
│
├── Store_App.Core/
│   ├── Entities/
│   │   ├── User.cs
│   │   ├── Product.cs
│   │   ├── Cart.cs
│   │   ├── CartItem.cs
│   │   ├── Order.cs
│   │   └── OrderItem.cs
│   ├── DTOs/
│   │   ├── UserDto.cs
│   │   ├── ProductDto.cs
│   │   ├── CartDto.cs
│   │   ├── OrderDto.cs
│   │   └── ApiResponse.cs
│   └── Store_App.Core.csproj
│
├── Store_App.Data/
│   ├── InMemoryDatabase.cs
│   ├── Repositories/
│   │   ├── IRepository.cs
│   │   ├── UserRepository.cs
│   │   ├── ProductRepository.cs
│   │   ├── CartRepository.cs
│   │   └── OrderRepository.cs
│   └── Store_App.Data.csproj
│
├── Store_App.Services/
│   ├── Exceptions/
│   │   └── StoreAppException.cs
│   ├── Services/
│   │   ├── IUserService.cs
│   │   ├── UserService.cs
│   │   ├── IProductService.cs
│   │   ├── ProductService.cs
│   │   ├── ICartService.cs
│   │   ├── CartService.cs
│   │   ├── IOrderService.cs
│   │   └── OrderService.cs
│   └── Store_App.Services.csproj
│
├── Store_App.Tests/
│   ├── Services/
│   │   ├── UserServiceTests.cs
│   │   ├── ProductServiceTests.cs
│   │   ├── CartServiceTests.cs
│   │   └── OrderServiceTests.cs
│   └── Store_App.Tests.csproj
│
└── Store_App.sln
```

## ✨ Features

### User Management
- ✅ Create new users
- ✅ Retrieve user information
- ✅ Update user details
- ✅ Delete users
- ✅ List all users

### Product Catalog
- ✅ Create products with pricing and stock
- ✅ Retrieve product details
- ✅ Filter products by category
- ✅ Update product information
- ✅ Delete products
- ✅ Stock availability checking

### Shopping Cart
- ✅ Create cart for users
- ✅ Add products to cart
- ✅ Update item quantities
- ✅ Remove items from cart
- ✅ Clear entire cart
- ✅ View cart with totals

### Order Management
- ✅ Place orders from cart
- ✅ View order history
- ✅ Update order status
- ✅ Cancel pending orders
- ✅ Filter orders by status
- ✅ Track order items and totals

## 🛠️ Technology Stack

- **Framework**: .NET 8.0
- **Web API**: ASP.NET Core Web API
- **Language**: C# 12
- **Testing**: xUnit
- **Mocking**: Moq
- **Logging**: Serilog
- **Documentation**: Swagger/OpenAPI

## 🚀 Getting Started

### Prerequisites

- .NET 8.0 SDK or later
- Visual Studio 2022 / Visual Studio Code / JetBrains Rider

### Build and Run

```bash
# Restore dependencies
dotnet restore

# Build the solution
dotnet build

# Run the API
dotnet run --project Store_App.API

# Run tests
dotnet test

# Run specific test project
dotnet test Store_App.Tests
```

### Running the API

The API will start on `https://localhost:7000` (HTTPS) and `http://localhost:5000` (HTTP).

Access the Swagger UI at: `https://localhost:7000/swagger/index.html`

## 📡 API Endpoints

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/{id}` | Get user by ID |
| POST | `/api/users` | Create new user |
| PUT | `/api/users/{id}` | Update user |
| DELETE | `/api/users/{id}` | Delete user |

**Create User Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "555-0001"
}
```

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/{id}` | Get product by ID |
| GET | `/api/products/category/{category}` | Get products by category |
| POST | `/api/products` | Create new product |
| PUT | `/api/products/{id}` | Update product |
| DELETE | `/api/products/{id}` | Delete product |

**Create Product Request:**
```json
{
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 999.99,
  "stockQuantity": 50,
  "category": "Electronics"
}
```

### Shopping Cart

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/carts/user/{userId}` | Get user's cart |
| POST | `/api/carts/user/{userId}/add` | Add product to cart |
| PUT | `/api/carts/user/{userId}/items/{cartItemId}` | Update cart item quantity |
| DELETE | `/api/carts/user/{userId}/items/{cartItemId}` | Remove item from cart |
| DELETE | `/api/carts/user/{userId}/clear` | Clear entire cart |

**Add to Cart Request:**
```json
{
  "productId": 1,
  "quantity": 2
}
```

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get all orders |
| GET | `/api/orders/{id}` | Get order by ID |
| GET | `/api/orders/user/{userId}` | Get user's orders |
| GET | `/api/orders/status/{status}` | Get orders by status |
| POST | `/api/orders/place` | Place new order |
| PUT | `/api/orders/{id}/status` | Update order status |
| PUT | `/api/orders/{id}/cancel` | Cancel order |

**Place Order Request:**
```json
{
  "userId": 1
}
```

**Update Order Status Request:**
```json
{
  "status": "Processing"
}
```

**Order Statuses**: Pending, Processing, Shipped, Delivered, Cancelled

## 💾 Database

The application uses an **In-Memory Database** for demonstration purposes. This allows:

- Quick testing without external dependencies
- Automatic initialization with sample data
- Thread-safe singleton pattern for data consistency

### Default Sample Data

**Users:**
- John Doe (john@example.com)
- Jane Smith (jane@example.com)
- Bob Johnson (bob@example.com)

**Products:**
- Laptop ($999.99) - 50 in stock
- Mouse ($29.99) - 200 in stock
- Keyboard ($79.99) - 100 in stock
- Monitor ($399.99) - 30 in stock

## 🧪 Testing

The project includes comprehensive unit tests using xUnit and Moq.

### Test Coverage

- **UserService Tests**: 7 test cases
  - Get user by ID (valid/invalid)
  - Get all users
  - Create user (valid/invalid data)
  - Update user
  - Delete user

- **ProductService Tests**: 7 test cases
  - Similar structure to user tests

- **CartService Tests**: 6 test cases
  - Add to cart
  - Remove from cart
  - Clear cart
  - Insufficient stock handling

- **OrderService Tests**: 8 test cases
  - Create order from cart
  - Update order status
  - Cancel order
  - Order retrieval and filtering

### Running Tests

```bash
# Run all tests
dotnet test

# Run with verbose output
dotnet test -v d

# Run specific test project
dotnet test Store_App.Tests

# Run specific test class
dotnet test Store_App.Tests --filter "UserServiceTests"

# Run specific test method
dotnet test Store_App.Tests --filter "UserServiceTests.GetUserByIdAsync_WithValidId_ReturnsUserDto"
```

## 🔧 Exception Handling

Custom exceptions provide meaningful error responses:

### Exception Types

1. **ResourceNotFoundException**: When a resource is not found (404)
2. **ValidationException**: When input validation fails (400)
3. **BusinessRuleException**: When business rules are violated (400)
4. **StoreAppException**: Base exception for all custom exceptions

### Error Response Format

```json
{
  "success": false,
  "message": "User with ID 999 not found",
  "data": null,
  "errors": []
}
```

### Exception Handling Middleware

The `ExceptionHandlingMiddleware` catches all unhandled exceptions and returns standardized error responses with appropriate HTTP status codes.

## 📝 Logging

The application uses **Serilog** for comprehensive logging:

- **Console Output**: Real-time logging to console
- **File Output**: Daily rolling file logs in `logs/` directory
- **Structured Logging**: Contextual information for debugging

### Log Examples

```
[INF] Fetching user with ID: 1
[INF] User created successfully with ID: 4
[WRN] User with ID 999 not found
[ERR] An unhandled exception has occurred: NullReferenceException
```

## 🔐 Dependency Injection

The project uses ASP.NET Core's built-in dependency injection container:

```csharp
// Register repositories
builder.Services.AddScoped<IRepository<User>>(sp => 
    new UserRepository(sp.GetRequiredService<InMemoryDatabase>()));

// Register services
builder.Services.AddScoped<IUserService, UserService>();

// Register in-memory database (singleton)
builder.Services.AddSingleton<InMemoryDatabase>(sp => 
    InMemoryDatabase.GetInstance());
```

## 📊 API Response Format

All API responses follow a standardized format:

### Success Response

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "errors": []
}
```

### Error Response

```json
{
  "success": false,
  "message": "User with ID 999 not found",
  "data": null,
  "errors": ["RESOURCE_NOT_FOUND"]
}
```

## 🎓 Design Patterns Used

- **Repository Pattern**: Data access abstraction
- **Dependency Injection**: Loose coupling and testability
- **Factory Pattern**: In-memory database singleton
- **DTO Pattern**: Data transfer between layers
- **Service Layer Pattern**: Business logic separation

## 📚 SOLID Principles

- **S**ingle Responsibility: Each class has one reason to change
- **O**pen/Closed: Classes open for extension, closed for modification
- **L**iskov Substitution: Services can be substituted with their implementations
- **I**nterface Segregation: Specific interfaces for specific needs
- **D**ependency Inversion: Depend on abstractions, not concrete implementations

## 🚨 Validation

- **User Validation**: Name, Email, Phone required
- **Product Validation**: Name, Price > 0, Stock >= 0, Category required
- **Cart Validation**: ProductId valid, Quantity > 0
- **Order Validation**: Cart not empty, User exists

## 📖 Code Documentation

All classes, methods, and properties include XML documentation comments for IntelliSense support and API documentation generation.

## 🔄 Async/Await Pattern

All data access and service operations use async/await for scalability:

```csharp
public async Task<UserDto> GetUserByIdAsync(int id)
{
    var user = await _userRepository.GetByIdAsync(id);
    return MapToDto(user);
}
```

## 📦 Dependencies

### NuGet Packages

- `Microsoft.AspNetCore.OpenApi` - OpenAPI support
- `Swashbuckle.AspNetCore` - Swagger UI
- `Serilog` - Structured logging
- `Serilog.AspNetCore` - ASP.NET Core integration
- `xunit` - Unit testing framework
- `Moq` - Mocking library

## 🛡️ Security Considerations

- Input validation on all endpoints
- Exception handling prevents information leakage
- CORS configured for cross-origin requests
- Structured error responses without sensitive details

## 📝 Naming Conventions

- **Namespaces**: PascalCase (Store_App.Services)
- **Classes**: PascalCase (UserService)
- **Methods**: PascalCase (GetUserByIdAsync)
- **Properties**: PascalCase (Name, Email)
- **Private Fields**: _camelCase (_logger)
- **Local Variables**: camelCase (user, userId)

## 🎯 Future Enhancements

- [ ] Authentication & Authorization (JWT)
- [ ] Database migration to SQL Server/PostgreSQL
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Advanced filtering and pagination
- [ ] Caching layer (Redis)
- [ ] API rate limiting
- [ ] Audit logging
- [ ] GraphQL support

## 📄 License

This project is provided as-is for educational and demonstration purposes.

## 🤝 Contributing

This is a demonstration project. Feel free to use it as a reference for your own projects.

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Framework**: .NET 8.0 with ASP.NET Core
