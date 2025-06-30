# 🛒 Django Multivendor E-commerce Platform

Welcome to the Django Multivendor E-commerce Platform! This project provides a comprehensive solution for managing a multivendor marketplace.

---

## ➡️ Base URL

All endpoints are available under:  
`/api/`

---

## 🔐 Authentication

Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-token-here>
```

---

## 🔎 Models Overview

- **User**

  - username: Unique username for the user
  - email: Email address of the user
  - password: Password for the user account

- **Vendor**

  - store_name: Unique name of the vendor's store
  - description: Description of the vendor's store
  - contact_email: Contact email of the vendor
  - phone: Contact phone number of the vendor
  - address: Address of the vendor's store

- **Product**

  - name: Name of the product
  - sku: Stock Keeping Unit of the product
  - price: Price of the product
  - stock: Available stock of the product
  - description: Description of the product
  - thumbnail: Thumbnail image of the product
  - video: Video of the product

- **Order**

  - status: Status of the order (Pending, Paid, Shipped, Delivered, Completed, Disputed)
  - payment_method: Payment method used for the order (Credit Card, PayPal)
  - payment_clearance_status: Status of the payment clearance (Pending, Cleared, Held)

- **OrderItem**

  - product: Reference to the product
  - quantity: Quantity of the product ordered

- **Review**

  - product: Reference to the product
  - user: Reference to the user who wrote the review
  - rating: Rating given by the user
  - comment: Comment provided by the user

- **Shipment**

  - order: Reference to the order
  - tracking_number: Tracking number of the shipment
  - carrier: Carrier of the shipment
  - shipped_date: Date when the shipment was shipped
  - estimated_delivery_date: Estimated delivery date of the shipment
  - status: Status of the shipment

- **Payment**

  - order: Reference to the order
  - amount: Amount of the payment
  - provider: Payment provider
  - transaction_id: Transaction ID of the payment
  - status: Status of the payment

- **VendorPayout**
  - vendor: Reference to the vendor
  - amount: Amount of the payout
  - status: Status of the payout
  - requested_at: Date when the payout was requested
  - paid_at: Date when the payout was paid

---

## 🚀 Endpoints

### 1. User Registration

• **POST /api/users/register/**  
Register a new user.  
Example body:

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Example response (HTTP 201):

```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "token": "jwt_token_here",
  "refresh": "refresh_token_here"
}
```

### 2. User Login

• **POST /api/users/login/**  
Login an existing user.  
Example body:

```json
{
  "username": "john_doe",
  "password": "password123"
}
```

Example response (HTTP 200):

```json
{
  "username": "john_doe",
  "token": "jwt_token_here",
  "refresh": "refresh_token_here"
}
```

### 3. List Products

• **GET /api/vendors/products/**  
Returns a list of products.  
Example response (HTTP 200):

```json
{
  "count": 10,
  "results": [
    {
      "id": 1,
      "name": "Product 1",
      "price": "19.99",
      "stock": 100,
      "description": "Description of product 1",
      "thumbnail": "url_to_thumbnail",
      "video": "url_to_video"
    }
  ]
}
```

### 4. Create Order

• **POST /api/orders/**  
Create a new order.  
Example body:

```json
{
  "payment_method": "Credit Card",
  "shipping_address": "123 Main St",
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
  "order_items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ]
}
```

### 5. Add Review

• **POST /api/reviews/**  
Add a review for a product.  
Example body:

```json
{
  "product": 1,
  "rating": 5,
  "comment": "Great product!"
}
```

Example response (HTTP 201):

```json
{
  "id": 1,
  "product": 1,
  "user": 1,
  "rating": 5,
  "comment": "Great product!"
}
```

---

## 📜 Business Rules

1. Only authenticated users can place orders.
2. Vendors can only see their own products and orders.
3. Admin users can manage all data.

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

Happy shopping! 🎉
