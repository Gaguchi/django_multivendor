# 👤 Users API Documentation

This document outlines the endpoints related to user management, including registration, authentication, profile retrieval, and updates.

---

## ➡️ Base URL

All user endpoints are available under:  
`/api/users/`

---

## 🔐 Authentication

Include the JWT token in the Authorization header for protected endpoints:

## Models Overview

The user system is composed of:

- A main User model (Django’s built-in).
- A UserProfile model extending user data:
  - user_type (vendor/customer)
  - first_name / last_name
  - phone and address

## 🚀 Endpoints

### 1. Register User

• POST /register/  
Creates a new user account with the supplied credentials.

Example Body:

```json
{
  "username": "jdoe",
  "email": "jdoe@example.com",
  "password": "strongPassword123"
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

• POST /login/  
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

### 3. Retrieve Profile

• GET /profile/  
Returns the authenticated user’s data including associated UserProfile fields.

Example Response (HTTP 200):

```json
{
  "username": "jdoe",
  "email": "jdoe@example.com",
  "profile": {
    "user_type": "customer",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "555-1234",
    "address": "123 Main St"
  }
}
```

### 4. Update Profile

• PATCH /profile/  
Updates user and/or profile fields. Any omitted fields remain unchanged.

Example Body:

```json
{
  "user": {
    "email": "newemail@example.com"
  },
  "profile": {
    "first_name": "Jane"
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
    "phone": "555-1234",
    "address": "123 Main St"
  }
}
```

### 5. List Users (Admin Only)

• GET /  
Lists all users. Usually admin-protected.

Example Response (HTTP 200):

```json
{
  "count": 25,
  "results": [
    {
      "id": 1,
      "username": "jdoe",
      "email": "jdoe@example.com",
      "profile": { "...": "..." }
    }
  ]
}
```

## 📜 Business Rules

1. Username and email must be unique.
2. Password length must be ≥ 8 characters.
3. Only admins can list or retrieve all users.
4. Users can only update their own profiles.

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
