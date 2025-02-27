# 🛍️ Orders API Documentation

Welcome to the Orders API! Below you'll find how to interact with order endpoints.

---

## ➡️ Base URL

All endpoints are available under:  
`/api/v1/orders/`

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

### 2. Create Order

• **POST /**  
Create a new order.  
Example body:

```json
{
  "payment_method": "Credit Card",
  "shipping_address": "123 Main St",
  # ...existing fields...
  "order_items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ]
}
```

Example response (HTTP 201):

```json
{
  "id": 1,
  "status": "Pending",
  # ...existing fields...
  "items": [...]
}
```

### 3. Cancel Order

• **POST /{id}/cancel/**  
Cancels an order if its status is "Pending."  
Example response (HTTP 200):

```json
{
  "status": "Order cancelled"
}
```

### 4. Process Pending Orders

• **POST /process-pending/** (Vendor only)  
Processes pending orders for payouts.  
Example response (HTTP 200):

```json
{
  "status": "success",
  "processed_orders": 5,
  # ...existing fields...
  "total_amount": "299.95"
}
```

### 5. List Pending Orders

You can fetch all pending orders (or limit them to a specific vendor if applicable).

• **GET /** with query parameter `status=Pending`  
Example request (all pending orders):

```
GET /api/v1/orders/?status=Pending
```

Example response (HTTP 200):

```json
{
  "count": 2,
  "results": [
    # ...existing fields...
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

If you want pending orders for a specific vendor (if your API supports it), include an additional query parameter like `vendor_id` or similar.  
Example request:

```
GET /api/v1/orders/?status=Pending&vendor_id=2
```

---

## 📜 Business Rules

1. Payment is held for 7 days after delivery before clearing.
2. Disputed orders have payments on hold.
3. Only “Pending” orders can be cancelled.

---

## 🚨 Error Codes

• **401 Unauthorized**

````json
{"detail": "Authentication credentials were not provided."}```

• **403 Forbidden**
```json
{"detail": "You do not have permission to perform this action."}```

• **404 Not Found**
```json
{"detail": "Not found."}```

• **400 Bad Request**
```json
{"field_name": ["Error message"]}```

---

Happy ordering! 🎉
````
