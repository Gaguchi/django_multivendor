# 📦 Products API Documentation

This document outlines how to list, create, update, and delete products. These endpoints are under the vendor’s domain, requiring vendor authentication or a valid master token where specified.

---

## ➡️ Base URL

All product-related endpoints are referenced at:
`/api/vendors/products/`

---

## 🔐 Authentication

Include the JWT token (or master token, if applicable) in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

or

```
X-Master-Token: <master-token>
```

---

## 🚀 Endpoints

### 1. List Products

• GET /
Retrieves all products (or optionally filter by vendor_id if supported).

Example Request:

```
GET /api/vendors/products
Authorization: Bearer <jwt-token>
```

Example Response (HTTP 200):

```json
[
  {
    "id": 101,
    "name": "Example Gadget",
    "price": "49.99",
    "stock": 10
    // ...existing fields...
  }
]
```

### 2. Create Product

• POST /
Creates a new product for the authenticated vendor.

Example Body:

```json
{
  "name": "Super Widget",
  "price": 29.99,
  "stock": 5,
  "description": "Widget details"
}
```

Example Response (HTTP 201):

```json
{
  "id": 202,
  "name": "Super Widget",
  "price": "29.99",
  "stock": 5,
  "description": "Widget details"
  // ...existing fields...
}
```

### 3. Retrieve Single Product

• GET /{id}/
Fetches a single product by its ID.

Example Request:

```
GET /api/vendors/products/202
Authorization: Bearer <jwt-token>
```

Example Response (HTTP 200):

```json
{
  "id": 202,
  "name": "Super Widget",
  "price": "29.99",
  "stock": 5,
  "description": "Widget details"
  // ...existing fields...
}
```

### 4. Update Product

• PUT /{id}/
Updates details of a product owned by the authenticated vendor.

Example Body:

```json
{
  "price": 34.99,
  "stock": 10
}
```

Example Response (HTTP 200):

```json
{
  "id": 202,
  "name": "Super Widget",
  "price": "34.99",
  "stock": 10
  // ...existing fields...
}
```

### 5. Delete Product

• DELETE /{id}/
Removes a product owned by the authenticated vendor.

Example Response (HTTP 204): No content.

---

## 🎉 Other Actions

• GET /my_products/
Lists only products associated with the current vendor.

---

## 📜 Business Rules

1. Only vendors can create, update, or delete products unless using the master token.
2. Product stock must be ≥ 0.
3. Price must be ≥ 0.

---

## 🚨 Error Codes

- **401 Unauthorized**

```json
{ "detail": "Authentication credentials were not provided." }
```

- **403 Forbidden**

```json
{ "detail": "You do not have permission to perform this action." }
```

- **404 Not Found**

```json
{ "detail": "Not found." }
```

- **400 Bad Request**

```json
{ "field_name": ["Error message"] }
```
