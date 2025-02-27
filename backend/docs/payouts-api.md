# 💰 Payouts API Documentation

Manage vendor payout transactions. Vendors can view their own payouts and process pending payouts.

---

## ➡️ Base URL

`/api/payouts/`

---

## 🚀 Endpoints

### 1. List Vendor Payouts

• GET /  
Returns all payout records for the authenticated vendor (or all if admin).

Example Response (HTTP 200):

```json
[
  {
    "id": 1,
    "vendor": {
      "id": 5,
      "name": "Vendor Name"
      // ...existing code...
    },
    "amount": "150.00",
    "status": "pending",
    "requested_at": "2023-01-15T10:00:00Z"
  }
  // ...existing code...
]
```

### 2. Retrieve a Payout

• GET /{id}/  
Returns details of a specific payout record.

Example Response (HTTP 200):

```json
{
  "id": 1,
  "vendor": {
    "id": 5,
    "name": "Vendor Name"
    // ...existing code...
  },
  "amount": "150.00",
  "status": "pending",
  "requested_at": "2023-01-15T10:00:00Z",
  "paid_at": null
}
```

### 3. Create Vendor Payout

• POST /  
Creates a new payout request for a vendor.

Request Body:

```json
{
  "vendor_id": 5,
  "amount": "150.00"
}
```

Example Response (HTTP 201):

```json
{
  "id": 2,
  "vendor": {
    "id": 5,
    "name": "Vendor Name"
    // ...existing code...
  },
  "amount": "150.00",
  "status": "pending",
  "requested_at": "2023-01-16T11:00:00Z",
  "paid_at": null
}
```

### 4. Process Pending Payouts

• POST /process_pending/  
Triggers processing of pending payouts for the authenticated vendor.

Example Response (HTTP 200):

```json
{
  "status": "success",
  "last_checked": "2023-01-16T12:00:00Z",
  "processed_orders": 3,
  "total_amount": "450.00"
}
```

### 5. Delete Payout (Optional)

• DELETE /{id}/  
Deletes a payout record (admin only).

Example Response (HTTP 204):

// ...existing code...

---

## ⚙️ Business Rules

- Vendors can only access their own payout records.
- Only admins can view all payouts or delete records.
- Payout amounts must be positive and reflect valid transactions.
- Processing pending payouts updates their status accordingly.

---

## ❌ Error Responses

- **400 Bad Request**

```json
{ "error": "Invalid amount" }
```

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
{ "detail": "Payout not found" }
```
