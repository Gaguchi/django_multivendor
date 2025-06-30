# 🙋 Reviews API Documentation

This document explains how to list, create, update, and delete product reviews. Access to these endpoints requires user authentication. Staff users see all reviews; regular users only see the ones they created.

---

## ➡️ Base URL

All review endpoints are available under:
`/api/reviews/`

---

## 🔐 Authentication

Include a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## 🚀 Endpoints

### 1. List Reviews

• GET /  
Retrieves all reviews if the user is staff, otherwise fetches only reviews by the current user.

Example Response (HTTP 200):

```json
[
  {
    "id": 42,
    "product": 101,
    "user": 15,
    "rating": 5,
    "comment": "Great product!"
    // ...existing fields...
  }
]
```

### 2. Create a Review

• POST /  
Creates a new review for a given product.

Example Body:

```json
{
  "product": 101,
  "rating": 4,
  "comment": "Pretty good!"
}
```

Example Response (HTTP 201):

```json
{
  "id": 43,
  "product": 101,
  "user": 15,
  "rating": 4,
  "comment": "Pretty good!"
  // ...existing fields...
}
```

### 3. Retrieve Single Review

• GET /{id}/  
Retrieves a specific review by its ID.

Example Response (HTTP 200):

```json
{
  "id": 43,
  "product": 101,
  "rating": 4
  // ...existing fields...
}
```

### 4. Update Review

• PATCH /{id}/  
Updates an existing review (only permitted if the review belongs to the current user, or user is staff).

Example Body:

```json
{
  "rating": 3,
  "comment": "Changed my mind!"
}
```

Example Response (HTTP 200):

```json
{
  "id": 43,
  "product": 101,
  "rating": 3,
  "comment": "Changed my mind!"
  // ...existing fields...
}
```

### 5. Delete Review

• DELETE /{id}/  
Deletes an existing review (requires staff or ownership).

Example Response (HTTP 204): No content.

---

## 🔒 Permissions

1. Staff users see and manage all reviews.
2. Regular users can only see their own reviews.
3. Attempting to modify another user’s review will result in a 403.

---

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
