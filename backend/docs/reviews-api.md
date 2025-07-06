# ⭐ Reviews API Documentation

This document provides details on how to manage product reviews, including creating reviews with media uploads, fetching reviewable items, and displaying product reviews.

---

## ➡️ Base URL

All review endpoints are available under:  
`/api/reviews/`

---

## 🔐 Authentication

All endpoints require authentication. Ensure your JWT token is included in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Models Overview

- **Review** (belongs to a User and VendorProduct, contains rating, comment, and optional order reference)
- **ReviewImage** (belongs to a Review, contains uploaded image files)
- **ReviewVideo** (belongs to a Review, contains uploaded video files)

## 🚀 Endpoints

### 1. List User Reviews

• **GET** `/`  
Fetches all reviews created by the authenticated user.

**Example Request:**

```bash
curl -X GET "https://api.bazro.ge/api/reviews/" \
  -H "Authorization: Bearer <your_jwt_token>"
```

**Example Response:**

```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "rating": 5,
      "comment": "Excellent product! Highly recommended.",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "product": {
        "id": 123,
        "name": "Premium Headphones",
        "vendor": {
          "id": 5,
          "business_name": "TechStore"
        },
        "image": "https://api.bazro.ge/media/vendor_products/headphones.jpg"
      },
      "user": {
        "id": 10,
        "username": "john_doe",
        "first_name": "John",
        "last_name": "Doe"
      },
      "order": {
        "order_number": "ORD-2024-001"
      },
      "images": [
        {
          "id": 1,
          "image": "https://api.bazro.ge/media/review_images/review_1_img1.jpg",
          "alt_text": "Review image for Premium Headphones"
        }
      ],
      "videos": []
    }
  ]
}
```

---

### 2. Create Review

• **POST** `/`  
Creates a new review for a product. Supports file uploads for images and videos.

**Content-Type:** `multipart/form-data`

**Required Fields:**

- `product` (integer): Product ID
- `rating` (integer): Rating from 1-5
- `comment` (string): Review comment

**Optional Fields:**

- `order` (integer): Order ID (if review is for a specific order)
- `images` (files): Multiple image files
- `videos` (files): Multiple video files

**Example Request:**

```bash
curl -X POST "https://api.bazro.ge/api/reviews/" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -F "product=123" \
  -F "rating=5" \
  -F "comment=Great product, fast delivery!" \
  -F "order=456" \
  -F "images=@review_photo1.jpg" \
  -F "images=@review_photo2.jpg" \
  -F "videos=@review_video.mp4"
```

**Example Response:**

```json
{
  "id": 2,
  "rating": 5,
  "comment": "Great product, fast delivery!",
  "created_at": "2024-01-15T14:20:00Z",
  "updated_at": "2024-01-15T14:20:00Z",
  "product": {
    "id": 123,
    "name": "Premium Headphones",
    "vendor": {
      "id": 5,
      "business_name": "TechStore"
    },
    "image": "https://api.bazro.ge/media/vendor_products/headphones.jpg"
  },
  "user": {
    "id": 10,
    "username": "john_doe",
    "first_name": "John",
    "last_name": "Doe"
  },
  "order": {
    "order_number": "ORD-2024-002"
  },
  "images": [
    {
      "id": 2,
      "image": "https://api.bazro.ge/media/review_images/review_2_img1.jpg",
      "alt_text": "Review image for Premium Headphones"
    },
    {
      "id": 3,
      "image": "https://api.bazro.ge/media/review_images/review_2_img2.jpg",
      "alt_text": "Review image for Premium Headphones"
    }
  ],
  "videos": [
    {
      "id": 1,
      "video": "https://api.bazro.ge/media/review_videos/review_2_vid1.mp4"
    }
  ]
}
```

---

### 3. Get Reviewable Items

• **GET** `/reviewable_items/`  
Fetches items that the authenticated user can review (delivered orders that haven't been reviewed yet).

**Query Parameters:**

- `can_review_only` (boolean): Set to `true` to only return items that can be reviewed (default shows all delivered items)

**Example Request:**

```bash
curl -X GET "https://api.bazro.ge/api/reviews/reviewable_items/?can_review_only=true" \
  -H "Authorization: Bearer <your_jwt_token>"
```

**Example Response:**

```json
[
  {
    "order_number": "ORD-2024-003",
    "product": {
      "id": 456,
      "name": "Wireless Mouse",
      "vendor": {
        "id": 7,
        "business_name": "ElectroShop"
      },
      "image": "https://api.bazro.ge/media/vendor_products/mouse.jpg"
    },
    "delivered_at": "2024-01-10T09:15:00Z",
    "can_review": true,
    "has_reviewed": false
  }
]
```

---

### 4. Check if User Can Review Product

• **GET** `/can-review/{product_id}/`  
Checks if the authenticated user can review a specific product.

**URL Parameters:**

- `product_id` (integer): The ID of the product to check

**Example Request:**

```bash
curl -X GET "https://api.bazro.ge/api/reviews/can-review/123/" \
  -H "Authorization: Bearer <your_jwt_token>"
```

**Example Response:**

```json
{
  "can_review": true,
  "has_purchased": true,
  "has_reviewed": false
}
```

---

### 5. Check if User Has Reviewed Product

• **GET** `/has-reviewed/{product_id}/`  
Checks if the authenticated user has already reviewed a specific product.

**URL Parameters:**

- `product_id` (integer): The ID of the product to check

**Example Request:**

```bash
curl -X GET "https://api.bazro.ge/api/reviews/has-reviewed/123/" \
  -H "Authorization: Bearer <your_jwt_token>"
```

**Example Response:**

```json
{
  "has_reviewed": false
}
```

---

### 6. Get Product Reviews (Public)

• **GET** `/product_reviews/?product_id={product_id}`  
Fetches all reviews for a specific product with aggregated statistics.

**Query Parameters:**

- `product_id` (integer): The ID of the product

**Example Request:**

```bash
curl -X GET "https://api.bazro.ge/api/reviews/product_reviews/?product_id=123" \
  -H "Authorization: Bearer <your_jwt_token>"
```

**Example Response:**

```json
{
  "results": [
    {
      "id": 1,
      "rating": 5,
      "comment": "Excellent product! Highly recommended.",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "product": {
        "id": 123,
        "name": "Premium Headphones",
        "vendor": {
          "id": 5,
          "business_name": "TechStore"
        },
        "image": "https://api.bazro.ge/media/vendor_products/headphones.jpg"
      },
      "user": {
        "id": 10,
        "username": "john_doe",
        "first_name": "John",
        "last_name": "Doe"
      },
      "order": {
        "order_number": "ORD-2024-001"
      },
      "images": [
        {
          "id": 1,
          "image": "https://api.bazro.ge/media/review_images/review_1_img1.jpg",
          "alt_text": "Review image for Premium Headphones"
        }
      ],
      "videos": []
    }
  ],
  "average_rating": 4.8,
  "total_reviews": 15
}
```

---

### 7. Update Review

• **PUT** `/{id}/`  
Updates an existing review. Only the review author can update their review.

**Content-Type:** `multipart/form-data`

**Example Request:**

```bash
curl -X PUT "https://api.bazro.ge/api/reviews/1/" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -F "rating=4" \
  -F "comment=Updated review - still a great product!" \
  -F "images=@new_review_photo.jpg"
```

---

### 8. Delete Review

• **DELETE** `/{id}/`  
Deletes an existing review. Only the review author can delete their review.

**Example Request:**

```bash
curl -X DELETE "https://api.bazro.ge/api/reviews/1/" \
  -H "Authorization: Bearer <your_jwt_token>"
```

**Example Response:**

```
HTTP/1.1 204 No Content
```

---

## 📁 File Upload Guidelines

### Supported Image Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- Maximum size: 10MB per image

### Supported Video Formats

- MP4 (.mp4)
- WebM (.webm)
- MOV (.mov)
- Maximum size: 50MB per video

### Upload Limits

- Maximum 5 images per review
- Maximum 2 videos per review

---

## 🚨 Error Responses

### 400 Bad Request

```json
{
  "error": "Invalid data provided",
  "details": {
    "rating": ["This field is required."],
    "product": ["This field is required."]
  }
}
```

### 401 Unauthorized

```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden

```json
{
  "error": "You can only review products you have purchased and received."
}
```

### 404 Not Found

```json
{
  "error": "Product not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Failed to create review. Please try again."
}
```

---

## 🧪 Testing with Postman

### Setting up Authentication

1. **Login Request:**

   - Method: POST
   - URL: `https://api.bazro.ge/api/auth/login/`
   - Body (JSON):
     ```json
     {
       "username": "your_username",
       "password": "your_password"
     }
     ```

2. **Copy the access token** from the response and use it in subsequent requests.

3. **Set Authorization Header:**
   - Type: Bearer Token
   - Token: `<your_access_token>`

### Sample Test Flow

1. **Get Reviewable Items:**

   - GET `https://api.bazro.ge/api/reviews/reviewable_items/?can_review_only=true`

2. **Create a Review:**

   - POST `https://api.bazro.ge/api/reviews/`
   - Body type: form-data
   - Add fields: product, rating, comment
   - Add files: images, videos

3. **View Your Reviews:**

   - GET `https://api.bazro.ge/api/reviews/`

4. **Check Product Reviews:**
   - GET `https://api.bazro.ge/api/reviews/product_reviews/?product_id=123`

---

## 🔄 Business Logic

### Review Eligibility Rules

1. **User must be authenticated**
2. **User must have purchased the product** (have a delivered order containing the product)
3. **User cannot review the same product twice**
4. **Only delivered orders count** towards review eligibility

### Review Permissions

- **Create:** Any authenticated user (following eligibility rules)
- **Read:**
  - Own reviews: Only the review author
  - Product reviews: Any authenticated user
- **Update:** Only the review author
- **Delete:** Only the review author

### Media Handling

- **Images and videos are processed and stored** in Django media files
- **Automatic alt text generation** for accessibility
- **File validation** for size and format
- **Secure file serving** through Django

---

## 💡 Notes

- All timestamps are in UTC format
- File uploads require `multipart/form-data` content type
- Review ratings are on a scale of 1-5 (integer values only)
- The system maintains order associations to track purchase history
- Review eligibility is checked in real-time to prevent unauthorized reviews
  // ...existing fields...
  }

````

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
````

- 403 Forbidden

```json
{ "detail": "You do not have permission to perform this action." }
```

- 404 Not Found

```json
{ "detail": "Not found." }
```
