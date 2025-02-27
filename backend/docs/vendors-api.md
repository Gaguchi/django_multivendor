# 🏪 Vendors API Documentation

This document explains how to interact with vendor-specific endpoints, including managing vendor profiles and product listings.

---

## ➡️ Base URL

All vendor endpoints are available under:  
`/api/vendors/`

---

## 🔐 Authentication

Use the JWT token for accessing vendor endpoints:

## Models Overview

- Vendor (links to a User, store info, contact details)
- VendorProduct (owned by a Vendor, includes pricing, stock, images)
- ProductImage (associated with a VendorProduct)

## 🚀 Endpoints

### 1. Vendor Registration

• POST /register/  
Creates a new vendor account.  
Example Body:

```json
{
  "email": "vendor@example.com",
  "password": "VendorPass123",
  "store_name": "TechWorld"
}
```

Example Response (HTTP 201):

```json
{
  "id": 1,
  "email": "vendor@example.com",
  "store_name": "TechWorld",
  "created_at": "2023-10-12T09:00:00Z"
}
```

### 2. Vendor Profile

• GET /profile/  
Retrieves the vendor’s profile along with store info.  
Example Response (HTTP 200):

```json
{
  "id": 1,
  "email": "vendor@example.com",
  "store_name": "TechWorld",
  "contact_email": "support@example.com",
  // ...existing fields...
  "created_at": "2023-10-12T09:00:00Z"
}
```

• PATCH /profile/  
Updates vendor details (store_name, description, etc.).  
Example Body:

```json
{
  "store_name": "TechWorld Inc",
  "contact_email": "help@techworld.com"
}
```

Example Response (HTTP 200):

```json
{
  "id": 1,
  "email": "vendor@example.com",
  "store_name": "TechWorld Inc",
  "contact_email": "help@techworld.com"
  // ...existing fields...
}
```

### 3. Product Management

• POST /products/  
Creates a new product under the authenticated vendor.  
Example Body:

```json
{
  "name": "Awesome Gadget",
  "price": 49.99,
  "stock": 10,
  "description": "Example"
}
```

Example Response (HTTP 201):

```json
{
  "id": 101,
  "name": "Awesome Gadget",
  "price": "49.99",
  "stock": 10,
  "description": "Example"
  // ...existing fields...
}
```

• GET /products/  
Lists all products for the current vendor.  
Example Response (HTTP 200):

```json
[
  {
    "id": 101,
    "name": "Awesome Gadget",
    "price": "49.99"
    // ...existing fields...
  }
]
```

• PUT /products/{id}/  
Updates a specific product.  
• DELETE /products/{id}/  
Deletes a specific product.

## 📜 Business Rules

1. Only authenticated vendors can manage products.
2. Vendors are identified by user_type = 'vendor' in their UserProfile.
3. Deleting a product may be soft-delete depending on your app’s config.

## 🚨 Error Codes

- 401 Unauthorized

```json
{ "detail": "Authentication credentials were not provided." }
```

- 403 Forbidden

```json
{ "detail": "You do not have permission to perform this action." }
```

- 404 Not Found

```json
{ "detail": "Not found." }
```

- 400 Bad Request

```json
{ "field_name": ["Error message"] }
```
