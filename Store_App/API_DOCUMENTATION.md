# Store App - Complete API Documentation

## Overview

This document provides detailed information about all API endpoints, request/response formats, status codes, and usage examples.

---

## Base URL

```
http://localhost:5000
https://localhost:7000
```

## Common Response Headers

```
Content-Type: application/json
Access-Control-Allow-Origin: *
```

---

## 📚 Detailed Endpoint Documentation

### USER MANAGEMENT ENDPOINTS

#### 1. Get All Users
**Endpoint**: `GET /api/users`

**Description**: Retrieves a list of all users in the system.

**Parameters**: None

**Request**:
```http
GET /api/users HTTP/1.1
Host: localhost:5000
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "555-0001",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phoneNumber": "555-0002",
      "createdAt": "2024-01-15T10:31:00Z"
    }
  ],
  "errors": []
}
```

**Status Codes**:
- `200 OK`: Successfully retrieved users
- `500 Internal Server Error`: Server error occurred

---

#### 2. Get User by ID
**Endpoint**: `GET /api/users/{id}`

**Description**: Retrieves a specific user by their ID.

**Path Parameters**:
- `id` (int, required): User ID

**Request**:
```http
GET /api/users/1 HTTP/1.1
Host: localhost:5000
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "555-0001",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "errors": []
}
```

**Response** (404 Not Found):
```json
{
  "success": false,
  "message": "User with ID 999 not found",
  "data": null,
  "errors": []
}
```

**Status Codes**:
- `200 OK`: User found
- `404 Not Found`: User does not exist
- `500 Internal Server Error`: Server error occurred

---

#### 3. Create User
**Endpoint**: `POST /api/users`

**Description**: Creates a new user in the system.

**Request Body**:
```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "phoneNumber": "555-0003"
}
```

**Request**:
```http
POST /api/users HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "phoneNumber": "555-0003"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 4,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "phoneNumber": "555-0003",
    "createdAt": "2024-01-15T14:45:00Z"
  },
  "errors": []
}
```

**Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "User validation failed",
  "data": null,
  "errors": [
    "Name is required",
    "Email is required",
    "PhoneNumber is required"
  ]
}
```

**Status Codes**:
- `201 Created`: User created successfully
- `400 Bad Request`: Validation failed
- `500 Internal Server Error`: Server error occurred

**Validation Rules**:
- `name`: Required, string
- `email`: Required, string, valid email format
- `phoneNumber`: Required, string

---

#### 4. Update User
**Endpoint**: `PUT /api/users/{id}`

**Description**: Updates an existing user's information.

**Path Parameters**:
- `id` (int, required): User ID

**Request Body**:
```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "phoneNumber": "555-9999"
}
```

**Request**:
```http
PUT /api/users/1 HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "phoneNumber": "555-9999"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "phoneNumber": "555-9999",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "errors": []
}
```

**Status Codes**:
- `200 OK`: User updated successfully
- `400 Bad Request`: Validation failed
- `404 Not Found`: User does not exist
- `500 Internal Server Error`: Server error occurred

---

#### 5. Delete User
**Endpoint**: `DELETE /api/users/{id}`

**Description**: Deletes a user from the system.

**Path Parameters**:
- `id` (int, required): User ID

**Request**:
```http
DELETE /api/users/1 HTTP/1.1
Host: localhost:5000
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": null,
  "errors": []
}
```

**Response** (404 Not Found):
```json
{
  "success": false,
  "message": "User with ID 999 not found",
  "data": null,
  "errors": []
}
```

**Status Codes**:
- `200 OK`: User deleted successfully
- `404 Not Found`: User does not exist
- `500 Internal Server Error`: Server error occurred

---

### PRODUCT CATALOG ENDPOINTS

#### 1. Get All Products
**Endpoint**: `GET /api/products`

**Description**: Retrieves all products from the catalog.

**Request**:
```http
GET /api/products HTTP/1.1
Host: localhost:5000
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "description": "High-performance laptop",
      "price": 999.99,
      "stockQuantity": 50,
      "category": "Electronics",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "errors": []
}
```

---

#### 2. Get Product by ID
**Endpoint**: `GET /api/products/{id}`

**Description**: Retrieves a specific product by ID.

**Path Parameters**:
- `id` (int, required): Product ID

**Request**:
```http
GET /api/products/1 HTTP/1.1
Host: localhost:5000
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "id": 1,
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "stockQuantity": 50,
    "category": "Electronics",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  },
  "errors": []
}
```

---

#### 3. Get Products by Category
**Endpoint**: `GET /api/products/category/{category}`

**Description**: Retrieves all products in a specific category.

**Path Parameters**:
- `category` (string, required): Product category

**Request**:
```http
GET /api/products/category/Electronics HTTP/1.1
Host: localhost:5000
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "price": 999.99,
      "category": "Electronics"
    },
    {
      "id": 4,
      "name": "Monitor",
      "price": 399.99,
      "category": "Electronics"
    }
  ],
  "errors": []
}
```

---

#### 4. Create Product
**Endpoint**: `POST /api/products`

**Description**: Creates a new product in the catalog.

**Request Body**:
```json
{
  "name": "USB-C Cable",
  "description": "High-speed USB-C charging cable",
  "price": 19.99,
  "stockQuantity": 500,
  "category": "Accessories"
}
```

**Request**:
```http
POST /api/products HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "name": "USB-C Cable",
  "description": "High-speed USB-C charging cable",
  "price": 19.99,
  "stockQuantity": 500,
  "category": "Accessories"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 5,
    "name": "USB-C Cable",
    "description": "High-speed USB-C charging cable",
    "price": 19.99,
    "stockQuantity": 500,
    "category": "Accessories",
    "createdAt": "2024-01-15T15:00:00Z",
    "updatedAt": "2024-01-15T15:00:00Z"
  },
  "errors": []
}
```

**Validation Rules**:
- `name`: Required, string
- `price`: Required, decimal > 0
- `stockQuantity`: Required, integer >= 0
- `category`: Required, string

---

#### 5. Update Product
**Endpoint**: `PUT /api/products/{id}`

**Description**: Updates an existing product.

**Path Parameters**:
- `id` (int, required): Product ID

**Request Body**:
```json
{
  "name": "Laptop Pro",
  "description": "Updated high-performance laptop",
  "price": 1299.99,
  "stockQuantity": 40,
  "category": "Electronics"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": 1,
    "name": "Laptop Pro",
    "price": 1299.99
  },
  "errors": []
}
```

---

#### 6. Delete Product
**Endpoint**: `DELETE /api/products/{id}`

**Description**: Deletes a product from the catalog.

**Path Parameters**:
- `id` (int, required): Product ID

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": null,
  "errors": []
}
```

---

### SHOPPING CART ENDPOINTS

#### 1. Get Cart for User
**Endpoint**: `GET /api/carts/user/{userId}`

**Description**: Retrieves the shopping cart for a specific user.

**Path Parameters**:
- `userId` (int, required): User ID

**Request**:
```http
GET /api/carts/user/1 HTTP/1.1
Host: localhost:5000
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Cart retrieved successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "cartItems": [
      {
        "id": 1,
        "productId": 1,
        "productName": "Laptop",
        "quantity": 2,
        "unitPrice": 999.99,
        "totalPrice": 1999.98,
        "addedAt": "2024-01-15T14:00:00Z"
      }
    ],
    "totalPrice": 1999.98,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T14:00:00Z"
  },
  "errors": []
}
```

---

#### 2. Add Product to Cart
**Endpoint**: `POST /api/carts/user/{userId}/add`

**Description**: Adds a product to the user's shopping cart.

**Path Parameters**:
- `userId` (int, required): User ID

**Request Body**:
```json
{
  "productId": 2,
  "quantity": 3
}
```

**Request**:
```http
POST /api/carts/user/1/add HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "productId": 2,
  "quantity": 3
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Product added to cart successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "cartItems": [
      {
        "id": 2,
        "productId": 2,
        "productName": "Mouse",
        "quantity": 3,
        "unitPrice": 29.99,
        "totalPrice": 89.97
      }
    ],
    "totalPrice": 89.97
  },
  "errors": []
}
```

**Response** (400 Bad Request - Insufficient Stock):
```json
{
  "success": false,
  "message": "Product Mouse has insufficient stock",
  "data": null,
  "errors": []
}
```

**Validation Rules**:
- `productId`: Required, valid product ID
- `quantity`: Required, integer > 0

---

#### 3. Update Cart Item Quantity
**Endpoint**: `PUT /api/carts/user/{userId}/items/{cartItemId}`

**Description**: Updates the quantity of an item in the cart.

**Path Parameters**:
- `userId` (int, required): User ID
- `cartItemId` (int, required): Cart item ID

**Request Body**:
```json
{
  "quantity": 5
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Cart item updated successfully",
  "data": {
    "cartItems": [
      {
        "quantity": 5,
        "totalPrice": 149.95
      }
    ]
  },
  "errors": []
}
```

---

#### 4. Remove Item from Cart
**Endpoint**: `DELETE /api/carts/user/{userId}/items/{cartItemId}`

**Description**: Removes a specific item from the cart.

**Path Parameters**:
- `userId` (int, required): User ID
- `cartItemId` (int, required): Cart item ID

**Request**:
```http
DELETE /api/carts/user/1/items/1 HTTP/1.1
Host: localhost:5000
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Item removed from cart successfully",
  "data": null,
  "errors": []
}
```

---

#### 5. Clear Cart
**Endpoint**: `DELETE /api/carts/user/{userId}/clear`

**Description**: Clears all items from the user's cart.

**Path Parameters**:
- `userId` (int, required): User ID

**Request**:
```http
DELETE /api/carts/user/1/clear HTTP/1.1
Host: localhost:5000
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Cart cleared successfully",
  "data": null,
  "errors": []
}
```

---

### ORDER MANAGEMENT ENDPOINTS

#### 1. Get All Orders
**Endpoint**: `GET /api/orders`

**Description**: Retrieves all orders in the system.

**Request**:
```http
GET /api/orders HTTP/1.1
Host: localhost:5000
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": [
    {
      "id": 1,
      "userId": 1,
      "orderItems": [
        {
          "id": 1,
          "productId": 1,
          "productName": "Laptop",
          "quantity": 1,
          "unitPrice": 999.99,
          "totalPrice": 999.99
        }
      ],
      "totalAmount": 999.99,
      "status": "Pending",
      "orderDate": "2024-01-15T15:30:00Z",
      "updatedAt": "2024-01-15T15:30:00Z"
    }
  ],
  "errors": []
}
```

---

#### 2. Get Order by ID
**Endpoint**: `GET /api/orders/{id}`

**Description**: Retrieves a specific order by ID.

**Path Parameters**:
- `id` (int, required): Order ID

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "orderItems": [
      {
        "id": 1,
        "productId": 1,
        "productName": "Laptop",
        "quantity": 1,
        "unitPrice": 999.99,
        "totalPrice": 999.99
      }
    ],
    "totalAmount": 999.99,
    "status": "Pending",
    "orderDate": "2024-01-15T15:30:00Z"
  },
  "errors": []
}
```

---

#### 3. Get User Orders
**Endpoint**: `GET /api/orders/user/{userId}`

**Description**: Retrieves all orders for a specific user.

**Path Parameters**:
- `userId` (int, required): User ID

**Request**:
```http
GET /api/orders/user/1 HTTP/1.1
Host: localhost:5000
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": [
    {
      "id": 1,
      "userId": 1,
      "totalAmount": 999.99,
      "status": "Pending"
    },
    {
      "id": 2,
      "userId": 1,
      "totalAmount": 1500.00,
      "status": "Shipped"
    }
  ],
  "errors": []
}
```

---

#### 4. Get Orders by Status
**Endpoint**: `GET /api/orders/status/{status}`

**Description**: Retrieves all orders with a specific status.

**Path Parameters**:
- `status` (string, required): Order status (Pending, Processing, Shipped, Delivered, Cancelled)

**Request**:
```http
GET /api/orders/status/Pending HTTP/1.1
Host: localhost:5000
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": [
    {
      "id": 1,
      "userId": 1,
      "status": "Pending",
      "totalAmount": 999.99
    }
  ],
  "errors": []
}
```

---

#### 5. Place Order
**Endpoint**: `POST /api/orders/place`

**Description**: Creates a new order from the user's cart items.

**Request Body**:
```json
{
  "userId": 1
}
```

**Request**:
```http
POST /api/orders/place HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "userId": 1
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "orderItems": [
      {
        "id": 1,
        "productId": 1,
        "productName": "Laptop",
        "quantity": 2,
        "unitPrice": 999.99,
        "totalPrice": 1999.98
      }
    ],
    "totalAmount": 1999.98,
    "status": "Pending",
    "orderDate": "2024-01-15T15:45:00Z",
    "updatedAt": "2024-01-15T15:45:00Z"
  },
  "errors": []
}
```

**Response** (400 Bad Request - Empty Cart):
```json
{
  "success": false,
  "message": "Cart is empty. Please add items before placing order",
  "data": null,
  "errors": ["EMPTY_CART"]
}
```

---

#### 6. Update Order Status
**Endpoint**: `PUT /api/orders/{id}/status`

**Description**: Updates the status of an existing order.

**Path Parameters**:
- `id` (int, required): Order ID

**Request Body**:
```json
{
  "status": "Processing"
}
```

**Request**:
```http
PUT /api/orders/1/status HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "status": "Processing"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "id": 1,
    "status": "Processing",
    "updatedAt": "2024-01-15T16:00:00Z"
  },
  "errors": []
}
```

**Valid Status Values**:
- `Pending`
- `Processing`
- `Shipped`
- `Delivered`
- `Cancelled`

---

#### 7. Cancel Order
**Endpoint**: `PUT /api/orders/{id}/cancel`

**Description**: Cancels a pending or processing order.

**Path Parameters**:
- `id` (int, required): Order ID

**Request**:
```http
PUT /api/orders/1/cancel HTTP/1.1
Host: localhost:5000
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": null,
  "errors": []
}
```

**Response** (400 Bad Request - Cannot Cancel):
```json
{
  "success": false,
  "message": "Cannot cancel order with status Delivered",
  "data": null,
  "errors": ["CANNOT_CANCEL_ORDER"]
}
```

---

## Status Codes Reference

| Code | Name | Description |
|------|------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Validation failed or business rule violation |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error occurred |

## Error Codes

| Code | Description |
|------|-------------|
| RESOURCE_NOT_FOUND | Requested resource does not exist |
| VALIDATION_ERROR | Input validation failed |
| BUSINESS_RULE_VIOLATION | Business rule constraint violated |
| EMPTY_CART | Cart is empty |
| INSUFFICIENT_STOCK | Product has insufficient stock |
| CANNOT_CANCEL_ORDER | Order cannot be cancelled in current status |

---

## Request/Response Content-Type

All requests and responses use `application/json` content type.

## Pagination (Future Enhancement)

The API will support pagination parameters:
- `pageNumber`: Page number (default: 1)
- `pageSize`: Items per page (default: 10)

## Filtering (Future Enhancement)

The API will support filtering parameters for list endpoints:
- By date range
- By price range
- By status
- By category

---

**Last Updated**: January 2024  
**API Version**: 1.0.0
