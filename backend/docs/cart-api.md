# 🛒 Cart API Documentation

This document provides details on how to manage the shopping cart, including adding, updating, and removing cart items.

---

## ➡️ Base URL

All cart endpoints are available under:  
`/api/v1/cart/`

---

## 🔐 Authentication

Ensure your JWT token is included in the Authorization header:

## Models Overview

- Cart (belongs to a User, contains multiple CartItems)
- CartItem (points to a product, quantity, and pricing info)

## 🚀 Endpoints

### 1. Current Cart

• GET /current/  
Fetches or creates the authenticated user’s active cart.

Example Request:

```
GET /api/v1/cart/current/
Authorization: Bearer <jwt-token>
```

Example Response (HTTP 200):

```json
{
  "id": 12,
  "items": [
    {
      "product": {
        "id": 101,
        "name": "Awesome Gadget"
        // ...existing fields...
      },
      "quantity": 3,
      "unit_price": "49.99",
      "total_price": "149.97"
    }
  ],
  "total": "149.97"
}
```

### 2. Add Item

• POST /add_item/  
Adds a product to the current cart. If it already exists, increments quantity.

Example Body:

```json
{
  "product_id": 101,
  "quantity": 1
}
```

Example Response (HTTP 200):

```json
{
  "id": 55,
  "product": {
    "id": 101,
    "name": "Awesome Gadget"
    // ...existing fields...
  },
  "quantity": 4,
  "unit_price": "49.99",
  "total_price": "199.96"
}
```

### 3. Remove Item

• POST /remove_item/  
Removes a product from the current cart by product_id.

Example Body:

```json
{
  "product_id": 101
}
```

Example Response (HTTP 204): No content (item successfully removed)

### 4. Update CartItem (Alternative)

If you prefer a regular PUT/PATCH approach, you can also call:  
• PUT /cart_items/{product_id}/  
Update the quantity of a cart item.

Example Body:

```json
{
  "quantity": 2
}
```

Example Response (HTTP 200):

```json
{
  "id": 55,
  "product": {
    "id": 101,
    "name": "Awesome Gadget"
    // ...existing fields...
  },
  "quantity": 2,
  "unit_price": "49.99",
  "total_price": "99.98"
}
```

## 📜 Business Rules

1. Only authenticated users can have a cart.
2. Attempting to add the same product increments quantity instead of creating duplicates.
3. Removing a product from the cart sets its items count to zero.

## 🚨 Error Codes

- 401 Unauthorized

```json
{ "detail": "Authentication credentials were not provided." }
```

- 404 Not Found

```json
{ "detail": "Not found." }
```

- 400 Bad Request

```json
{ "field_name": ["Error message"] }
```
