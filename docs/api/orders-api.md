# 🛍️ Orders API Documentation

Welcome to the Orders API! Below you'll find how to interact with order endpoints.

---

## ➡️ Base URL

All endpoints are available under:  
`/api/orders/`

---

## 🔐 Authentication

Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-token-here>
```

---

## 🔎 Models Overview

- **Order**

  - status: Pending, Paid, Shipped, Delivered, Completed, Disputed
  - payment_method: Credit Card, PayPal
  - payment_clearance_status: Pending, Cleared, Held

- **OrderItem**
  - References products via VendorProduct.

---

## 🚀 Endpoints

### 1. List Orders

• **GET /**  
Returns a paginated list of orders.  
Example response (HTTP 200):

```json
{
  "count": 10,
  "results": [
    {
      "id": 1,
      "order_number": "abcd1234",
      "status": "Pending",
      # ...existing fields...
      "items": [
        # ...existing items...
      ]
    }
  ]
}
```

### 2. Get Order Details

• **GET /{order_number}/**  
Returns a specific order by its order_number.  
Example request:

```
GET /api/orders/abcd1234/
```

Example response (HTTP 200):

```json
{
  "id": 1,
  "order_number": "abcd1234",
  "status": "Pending",
  "total_amount": "299.95",
  "payment_method": "Credit Card",
  "shipping_address": "123 Main St",
  "billing_address": "123 Main St",
  "created_at": "2023-05-05T12:00:00Z",
  "updated_at": "2023-05-05T12:00:00Z",
  "items": [
    {
      "id": 1,
      "product": {
        "id": 42,
        "name": "Wireless Headphones",
        "description": "High-quality wireless headphones with noise cancellation",
        "price": "129.99",
        "thumbnail": "/media/products/headphones.jpg"
      },
      "quantity": 2,
      "unit_price": "129.99",
      "total_price": "259.98"
    },
    {
      "id": 2,
      "product": {
        "id": 56,
        "name": "USB Cable",
        "description": "USB-C charging cable",
        "price": "19.99",
        "thumbnail": "/media/products/cable.jpg"
      },
      "quantity": 2,
      "unit_price": "19.99",
      "total_price": "39.98"
    }
  ]
}
```

### 3. Create Order

• **POST /**  
Create a new order.  
Example body:

```json
{
  "payment_method": "Credit Card",
  "shipping_address": "123 Main St",
  "billing_address": "123 Main St",
  "order_items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 2,
      "quantity": 1
    }
  ]
}
```

Example response (HTTP 201):

```json
{
  "id": 1,
  "order_number": "abcd1234",
  "status": "Pending",
  "total_amount": "299.95",
  "payment_method": "Credit Card",
  "shipping_address": "123 Main St",
  "billing_address": "123 Main St",
  "created_at": "2023-05-05T12:00:00Z",
  "updated_at": "2023-05-05T12:00:00Z",
  "items": [...]
}
```

### 4. Cancel Order

• **POST /{order_number}/cancel/**  
Cancels an order if its status is "Pending."  
Example request:

```
POST /api/orders/abcd1234/cancel/
```

Example response (HTTP 200):

```json
{
  "status": "Order cancelled"
}
```

### 5. List Orders By Status

You can fetch orders filtered by status.

• **GET /** with query parameter `status=Pending`  
Example request:

```
GET /api/orders/?status=Pending
```

Example response (HTTP 200):

```json
{
  "count": 2,
  "results": [
    {
      "id": 3,
      "order_number": "xyz789",
      "status": "Pending",
      "total_amount": "69.99",
      "payment_method": "Credit Card",
      "created_at": "2023-05-05T12:00:00Z",
      # ...existing fields...
    },
    # ...more orders...
  ]
}
```

### 6. Track Order

• **GET /track/{order_number}/**  
Track an order by its order number. This endpoint can be used by anyone with the order number but provides limited information for non-owners.

Example request:

```
GET /api/orders/track/abcd1234/
```

Example response for order owners (HTTP 200):

```json
{
  "data": {
    "id": 1,
    "order_number": "abcd1234",
    "status": "Shipped",
    "total_amount": "299.95",
    "payment_method": "Credit Card",
    "shipping_address": "123 Main St",
    "billing_address": "123 Main St",
    "created_at": "2023-05-05T12:00:00Z",
    "updated_at": "2023-05-06T09:00:00Z",
    "items": [
      // Full item details...
    ]
  },
  "is_owner": true
}
```

Example response for non-owners (HTTP 200):

```json
{
  "data": {
    "order_number": "abcd1234",
    "status": "Shipped",
    "created_at": "2023-05-05T12:00:00Z",
    "updated_at": "2023-05-06T09:00:00Z",
    "item_count": 3,
    "shipping_address": "123 Main St",
    "delivered_at": null
  },
  "is_owner": false
}
```

Example error response (HTTP 404):

```json
{
  "detail": "Order not found"
}
```

---

## 📜 Business Rules

1. Payment is held for 7 days after delivery before clearing.
2. Disputed orders have payments on hold.
3. Only "Pending" orders can be cancelled.
4. Orders can be looked up by both ID and order_number.
5. Order numbers are generated automatically and are unique.
6. Anyone with an order number can track basic order information.
7. Only the order owner can view complete order details including items and payment information.

---

## 🚨 Error Codes

• **401 Unauthorized**

```json
{ "detail": "Authentication credentials were not provided." }
```

• **403 Forbidden**

```json
{ "detail": "You do not have permission to perform this action." }
```

• **404 Not Found**

```json
{ "detail": "Not found." }
```

• **400 Bad Request**

```json
{ "field_name": ["Error message"] }
```

---

Happy ordering! 🎉
