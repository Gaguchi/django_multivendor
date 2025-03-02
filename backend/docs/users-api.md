# 👤 Users API Documentation

This document outlines the endpoints related to user management, including registration, authentication, profile retrieval, and updates.

---

## ➡️ Base URL

All user endpoints are available under:  
`/api/users/`

---

## 🔐 Authentication

Include the JWT token in the Authorization header for protected endpoints:

```
Authorization: Bearer <your-jwt-token>
```

## Models Overview

The user system is composed of:

- A main User model (Django's built-in).
- A UserProfile model extending user data:
  - user_type (vendor/customer)
  - first_name / last_name
  - phone
- Address model for storing shipping and billing addresses:
  - Multiple addresses per user
  - Different address types (shipping/billing/both)
  - Default address capability

## 🚀 Endpoints

### 1. Register User

• **POST /register/**  
Creates a new user account with the supplied credentials.

Example Body:

```json
{
  "username": "jdoe",
  "email": "jdoe@example.com",
  "password": "strongPassword123",
  "userprofile": {
    "first_name": "John",
    "last_name": "Doe",
    "phone": "555-123-4567"
  }
}
```

Example Response (HTTP 201):

```json
{
  "id": 1,
  "username": "jdoe",
  "email": "jdoe@example.com",
  "access": "<jwt-access-token>",
  "refresh": "<jwt-refresh-token>"
}
```

### 2. Login

• **POST /login/**  
Authenticates a user with their username and password.

Example Body:

```json
{
  "username": "jdoe",
  "password": "strongPassword123"
}
```

Example Response (HTTP 200):

```json
{
  "username": "jdoe",
  "access": "<jwt-access-token>",
  "refresh": "<jwt-refresh-token>"
}
```

### 3. Login or Register

• **POST /login-or-register/**  
Logs in if user exists, or creates a new account if not found.

Example Body:

```json
{
  "username": "jdoe",
  "email": "jdoe@example.com",
  "password": "strongPassword123"
}
```

Example Response (HTTP 200 for login, 201 for register):

```json
{
  "refresh": "<jwt-refresh-token>",
  "access": "<jwt-access-token>",
  "username": "jdoe",
  "expires_in": 3600
}
```

### 4. Retrieve Profile

• **GET /profile/**  
Returns the authenticated user's data including associated UserProfile fields and default addresses.

Example Response (HTTP 200):

```json
{
  "username": "jdoe",
  "email": "jdoe@example.com",
  "profile": {
    "user_type": "customer",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "555-1234"
  },
  "addresses": {
    "shipping": {
      "id": 1,
      "address_type": "shipping",
      "is_default": true,
      "full_name": "John Doe",
      "address_line1": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "postal_code": "12345",
      "country": "US",
      "phone_number": "555-1234"
      // other address fields...
    },
    "billing": null
  }
}
```

### 5. Update Profile

• **PATCH /profile/update/**  
Updates user and/or profile fields. Any omitted fields remain unchanged.

Example Body:

```json
{
  "user": {
    "email": "newemail@example.com"
  },
  "profile": {
    "first_name": "Jane",
    "phone": "555-987-6543"
  }
}
```

Example Response (HTTP 200):

```json
{
  "user": {
    "email": "newemail@example.com",
    "username": "jdoe"
  },
  "profile": {
    "user_type": "customer",
    "first_name": "Jane",
    "last_name": "Doe",
    "phone": "555-987-6543"
  }
}
```

### 6. Token Information

• **GET /token-info/**  
Returns information about the current JWT token.

Example Response (HTTP 200):

```json
{
  "token_type": "access",
  "exp": 1704067200,
  "iat": 1704063600,
  "jti": "4d6e9129e90b40a0a5f54f797c11a2a3",
  "user_id": 42,
  "username": "jdoe"
}
```

### 7. Social Authentication

#### Google OAuth2

• **POST /auth/google/callback/**  
Handles Google OAuth2 authentication flow completion.

Example Body:

```json
{
  "code": "<authorization-code>",
  "redirect_uri": "http://localhost:5173/auth/callback"
}
```

Example Response (HTTP 200):

```json
{
  "token": "<jwt-access-token>",
  "refresh": "<jwt-refresh-token>",
  "user": {
    "id": 1,
    "email": "user@gmail.com",
    "username": "user@gmail.com",
    "firstName": "John",
    "lastName": "Doe",
    "name": "John Doe",
    "profile": {
      "id": 1,
      "user_type": "customer"
    }
  }
}
```

#### Facebook OAuth

• **POST /auth/facebook/callback/**  
Handles Facebook OAuth authentication flow completion.

Example Body:

```json
{
  "code": "<authorization-code>",
  "redirect_uri": "http://localhost:5173/auth/callback"
}
```

Example Response (HTTP 200): Same format as Google callback response.

### 8. Address Management

#### List All Addresses

• **GET /addresses/**  
Lists all addresses for the current user.

Example Response (HTTP 200):

```json
[
  {
    "id": 1,
    "address_type": "shipping",
    "is_default": true,
    "full_name": "John Doe",
    "phone_number": "555-1234",
    "email": "jdoe@example.com",
    "address_line1": "123 Main St",
    "address_line2": "Apt 4B",
    "city": "Anytown",
    "state": "CA",
    "postal_code": "12345",
    "country": "USA",
    "apartment_number": "4B",
    "entrance_number": null,
    "floor": "2",
    "door_code": null,
    "delivery_instructions": "Leave at door",
    "created_at": "2023-12-01T12:00:00Z",
    "updated_at": "2023-12-01T12:00:00Z"
  }
]
```

#### Create New Address

• **POST /addresses/**  
Creates a new address for the current user.

Example Body:

```json
{
  "address_type": "shipping",
  "is_default": true,
  "full_name": "John Doe",
  "phone_number": "555-1234",
  "email": "jdoe@example.com",
  "address_line1": "123 Main St",
  "city": "Anytown",
  "state": "CA",
  "postal_code": "12345",
  "country": "USA"
}
```

Example Response (HTTP 201):

```json
{
  "id": 1,
  "address_type": "shipping",
  "is_default": true,
  "full_name": "John Doe",
  "phone_number": "555-1234",
  "email": "jdoe@example.com",
  "address_line1": "123 Main St",
  "address_line2": null,
  "city": "Anytown",
  "state": "CA",
  "postal_code": "12345",
  "country": "USA",
  "apartment_number": null,
  "entrance_number": null,
  "floor": null,
  "door_code": null,
  "delivery_instructions": null,
  "created_at": "2023-12-01T12:00:00Z",
  "updated_at": "2023-12-01T12:00:00Z"
}
```

#### Retrieve Specific Address

• **GET /addresses/{id}/**  
Retrieves a specific address by ID.

Example Response (HTTP 200): Returns the address object.

#### Update Address

• **PUT /addresses/{id}/**  
Fully updates an existing address.

• **PATCH /addresses/{id}/**  
Partially updates an existing address.

Example Body (PATCH):

```json
{
  "address_line1": "456 New Street",
  "city": "New City"
}
```

Example Response (HTTP 200): Returns the updated address object.

#### Delete Address

• **DELETE /addresses/{id}/**  
Deletes an address. This endpoint permanently removes an address from the user's account.

Example Request:

```
DELETE /api/users/addresses/1/
Authorization: Bearer <jwt-token>
```

Example Response (HTTP 204): No content

Error Response (HTTP 404):

```json
{
  "detail": "Not found."
}
```

Error Response (HTTP 403):

```json
{
  "detail": "You do not have permission to perform this action."
}
```

#### Get Default Address by Type

• **GET /addresses/default/{address_type}/**  
Gets the default address of a specific type ('shipping', 'billing', or 'both').

Valid values for `address_type`: `shipping`, `billing`, `both`

Example Response (HTTP 200): Returns the default address object.

Example Not Found (HTTP 404):

```json
{
  "detail": "No default shipping address found"
}
```

#### Set Default Address

• **POST /addresses/default/{address_type}/**  
Sets an existing address as the default for a specific type.

Valid values for `address_type`: `shipping`, `billing`, `both`

Example Body:

```json
{
  "address_id": 1
}
```

Example Response (HTTP 200): Returns the updated address object.

Example Error (HTTP 404):

```json
{
  "detail": "Address not found"
}
```

## 📜 Business Rules

1. Username and email must be unique.
2. Password length must be ≥ 8 characters.
3. Only admins can list or retrieve all users.
4. Users can only update their own profiles and addresses.
5. Setting an address as default will unset other addresses of the same type.
6. When setting an address type as "both", it unsets defaults for both shipping and billing.
7. Addresses can only be accessed by their owner.

## 🚨 Error Codes

- **400 Bad Request**

```json
{
  "field_name": ["Error message"]
}
```

- **401 Unauthorized**

```json
{
  "detail": "Authentication credentials were not provided."
}
```

- **403 Forbidden**

```json
{
  "detail": "You do not have permission to perform this action."
}
```

- **404 Not Found**

```json
{
  "detail": "Not found."
}
```
