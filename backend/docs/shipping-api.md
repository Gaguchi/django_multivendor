# 🚚 Shipping API Documentation

Manage shipment records for orders. Regular users see shipments for their orders, while staff can access all shipments.

---

## ➡️ Base URL

`/api/shipping/`

---

## 🚀 Endpoints

### 1. List Shipments

• GET /  
Returns all shipment records for the authenticated user (or all if staff).

Example Response (HTTP 200):

```json
[
  {
    "id": 1,
    "order": {
      "id": 10,
      "order_number": "ORD1234"
      // ...existing code...
    },
    "tracking_number": "TRACK123456",
    "carrier": "CarrierName",
    "status": "Shipped",
    "shipped_date": "2023-01-01T10:00:00Z"
  }
  // ...existing code...
]
```

### 2. Retrieve Shipment

• GET /{id}/  
Returns details of a specific shipment.

Example Response (HTTP 200):

```json
{
  "id": 1,
  "order": {
    "id": 10,
    "order_number": "ORD1234"
    // ...existing code...
  },
  "tracking_number": "TRACK123456",
  "carrier": "CarrierName",
  "status": "Shipped",
  "shipped_date": "2023-01-01T10:00:00Z",
  "estimated_delivery_date": "2023-01-05T10:00:00Z"
}
```

### 3. Create Shipment

• POST /  
Creates a new shipment record (admin only).

Request Body:

```json
{
  "order_id": 10,
  "tracking_number": "TRACK123456",
  "carrier": "CarrierName",
  "shipped_date": "2023-01-01T10:00:00Z",
  "estimated_delivery_date": "2023-01-05T10:00:00Z",
  "status": "Shipped"
}
```

Example Response (HTTP 201):

```json
{
  "id": 1,
  "order": {
    "id": 10,
    "order_number": "ORD1234"
    // ...existing code...
  },
  "tracking_number": "TRACK123456",
  "carrier": "CarrierName",
  "status": "Shipped",
  "shipped_date": "2023-01-01T10:00:00Z",
  "estimated_delivery_date": "2023-01-05T10:00:00Z"
}
```

### 4. Update Shipment Status

• PUT /{id}/  
Updates shipment details (e.g., marking as Delivered).

Request Body:

```json
{
  "status": "Delivered",
  "shipped_date": "2023-01-01T10:00:00Z",
  "estimated_delivery_date": "2023-01-05T10:00:00Z"
}
```

Example Response (HTTP 200):

```json
{
  "id": 1,
  "order": {
    "id": 10,
    "order_number": "ORD1234"
    // ...existing code...
  },
  "tracking_number": "TRACK123456",
  "carrier": "CarrierName",
  "status": "Delivered",
  "shipped_date": "2023-01-01T10:00:00Z",
  "estimated_delivery_date": "2023-01-05T10:00:00Z"
}
```

---

## ⚙️ Business Rules

- Only staff can create or update shipments.
- Regular users can only view shipment details for their orders.
- Shipment dates and tracking numbers must be valid.

---

## ❌ Error Responses

- **400 Bad Request**

```json
{ "error": "Invalid data" }
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
{ "detail": "Shipment not found" }
```
