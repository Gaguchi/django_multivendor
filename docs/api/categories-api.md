# 📂 Categories API Documentation

Manage hierarchical product categories. Categories can nest via a parent, identified by slug.

---

## ➡️ Base URL

`/api/categories/`

---

## 🚀 Endpoints

### 1. List Categories

• GET /  
Returns all categories.

Example Response (HTTP 200):

```json
[
  {
    "id": 1,
    "name": "Electronics",
    "slug": "electronics",
    "parent_category": null,
    "subcategories": [
      // ...existing code...
    ]
  }
]
```

### 2. Root Categories

• GET /root/  
Returns categories whose parent_category is null.

Example Response (HTTP 200):

```json
[
  {
    "id": 2,
    "name": "Outdoors",
    "slug": "outdoors"
    // ...existing code...
  }
]
```

### 3. Retrieve Category by Slug

• GET /{slug}/  
Example Response (HTTP 200):

```json
{
  "id": 3,
  "name": "Smartphones",
  "slug": "smartphones",
  "parent_category": 1
  // ...existing code...
}
```

### 4. Create Category (Admin only)

• POST /  
Example Body:

```json
{
  "name": "Gaming",
  "slug": "gaming"
}
```

Example Response (HTTP 201):

```json
{
  "id": 10,
  "name": "Gaming",
  "slug": "gaming"
  // ...existing code...
}
```

### 5. Update Category (Admin only)

• PATCH /{slug}/  
Updates a category’s name, parent, etc.

Example Body:

```json
{
  "name": "Video Games"
}
```

Example Response (HTTP 200):

```json
{
  "id": 10,
  "name": "Video Games"
  // ...existing code...
}
```

### 6. Delete Category (Admin only)

• DELETE /{slug}/  
Removes a category and optionally its subcategories (behavior depends on business rules).

---

## 🔒 Permissions

• List & retrieve: public.  
• Create, update, delete: only admins.

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
