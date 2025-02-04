# 💳 Payments API Documentation

Manage payment transactions for orders. Supports multiple payment providers and statuses.

---

## ➡️ Base URL

`/api/payments/`

---

## 🚀 Endpoints

### 1. List Payments

• GET /  
Returns all payment transactions for the authenticated user.

Example Response (HTTP 200):

```json
[
  {
    "id": "123",
    "amount": 100.0,
    "currency": "USD",
    "provider": "PayPal",
    "status": "completed",
    "created_at": "2023-01-01T00:00:00Z"
  }
  // ...existing code...
]
```

### 2. Retrieve Payment

• GET /{id}/  
Returns details of a specific payment transaction.

Example Response (HTTP 200):

```json
{
  "id": "123",
  "amount": 100.0,
  "currency": "USD",
  "provider": "PayPal",
  "status": "completed",
  "created_at": "2023-01-01T00:00:00Z"
}
```

### 3. Create Payment

• POST /  
Creates a new payment transaction.

Request Body:

```json
{
  "amount": 100.0,
  "currency": "USD",
  "provider": "PayPal"
}
```

Example Response (HTTP 201):

```json
{
  "id": "123",
  "amount": 100.0,
  "currency": "USD",
  "provider": "PayPal",
  "status": "pending",
  "created_at": "2023-01-01T00:00:00Z"
}
```

### 4. Process Payment

• PUT /{id}/  
Updates the status of a payment transaction.

Request Body:

```json
{
  "status": "completed"
}
```

Example Response (HTTP 200):

```json
{
  "id": "123",
  "amount": 100.0,
  "currency": "USD",
  "provider": "PayPal",
  "status": "completed",
  "created_at": "2023-01-01T00:00:00Z"
}
```

### 5. Delete Payment (Optional)

• DELETE /{id}/  
Deletes a specific payment transaction.

Example Response (HTTP 204):

```

---

## ⚙️ Business Rules

- Payments can only be created for valid orders.
- Payment amounts must be positive.
- Only authorized users can process or delete payments.

---

## ❌ Error Responses

- `400 Bad Request`: The request could not be understood or was missing required parameters.
- `401 Unauthorized`: Authentication failed or user does not have permissions for the requested operation.
- `404 Not Found`: The requested resource could not be found.
- `500 Internal Server Error`: An error occurred on the server.
```
