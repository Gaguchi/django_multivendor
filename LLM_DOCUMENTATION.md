# 🤖 LLM Documentation: Django Multivendor E-commerce Platform

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [Project Structure](#project-structure)
4. [Database Models & Relationships](#database-models--relationships)
5. [API Endpoints Reference](#api-endpoints-reference)
6. [Authentication & Security](#authentication--security)
7. [Frontend Structure](#frontend-structure)
8. [Key Features & Business Logic](#key-features--business-logic)
9. [Configuration & Settings](#configuration--settings)
10. [Development Workflow](#development-workflow)
11. [Common Patterns & Code Examples](#common-patterns--code-examples)
12. [Troubleshooting Guide](#troubleshooting-guide)

---

## 🔍 Project Overview

This is a comprehensive **Django REST API + React** multivendor e-commerce platform that allows multiple vendors to sell products through a unified marketplace. The system supports customer shopping, vendor management, order processing, payments, and comprehensive user authentication.

### Core Capabilities

- **Multi-vendor marketplace** with vendor product management
- **JWT + Social OAuth authentication** (Google, Facebook)
- **Shopping cart with session/user persistence**
- **Order management with tracking**
- **Payment processing and vendor payouts**
- **Product categories with attributes**
- **Reviews and ratings system**
- **Shipping management**
- **Address management**
- **Wishlist functionality**

---

## 🏗️ Architecture & Technology Stack

### Backend (Django)

- **Framework**: Django 4.2+ with Django REST Framework
- **Database**: SQLite (development), supports PostgreSQL (production)
- **Authentication**: JWT (Simple JWT) + Master Token + Social Auth
- **API**: RESTful API with ViewSets and serializers
- **Middleware**: CORS, Request/Response Logging, Security

### Frontend

- **Customer Frontend**: React (Vite) - `/frontend/`
- **Admin Frontend**: React (separate app) - `/frontend-admin/`
- **State Management**: Context API with AuthContext
- **HTTP Client**: Axios with interceptors
- **UI**: Bootstrap-based responsive design

### Key Dependencies

```python
# Backend dependencies
django>=4.2
djangorestframework
djangorestframework-simplejwt
django-cors-headers
social-auth-app-django
django-extensions
requests
```

---

## 📁 Project Structure

```
django_multivendor/
├── backend/
│   ├── django_multivendor/        # Main Django project
│   │   ├── settings.py            # Configuration hub
│   │   ├── urls.py               # Main URL routing
│   │   ├── middleware.py         # Custom middleware
│   │   └── wsgi.py
│   ├── users/                    # User management & auth
│   │   ├── models.py            # User, UserProfile, Address
│   │   ├── views.py             # Auth views + social login
│   │   ├── serializers.py       # User serializers
│   │   ├── urls.py              # User endpoints
│   │   └── pipeline.py          # Social auth pipeline
│   ├── vendors/                 # Vendor & product management
│   │   ├── models.py           # Vendor, VendorProduct, ProductImage
│   │   ├── views.py            # Vendor/product CRUD
│   │   ├── serializers.py      # Product serializers
│   │   ├── authentication.py   # Master token auth
│   │   └── urls.py
│   ├── cart/                   # Shopping cart
│   │   ├── models.py          # Cart, CartItem
│   │   ├── views.py           # Cart operations
│   │   └── serializers.py
│   ├── orders/                # Order management
│   │   ├── models.py         # Order, OrderItem
│   │   ├── views.py          # Order processing
│   │   └── serializers.py
│   ├── payments/             # Payment processing
│   ├── payouts/              # Vendor payouts
│   ├── categories/           # Product categories & attributes
│   ├── reviews/              # Product reviews
│   ├── shipping/             # Shipping management
│   ├── docs/                 # API documentation
│   ├── media/                # Uploaded files
│   ├── static/               # Static files
│   └── requirements.txt
├── frontend/                 # Customer React app
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── contexts/         # React contexts (AuthContext)
│   │   ├── services/         # API services
│   │   ├── pages/           # Page components
│   │   ├── assets/          # CSS, images, fonts
│   │   └── App.jsx          # Main app component
│   ├── public/
│   └── package.json
├── frontend-admin/          # Admin React app
└── README.md
```

---

## 🗄️ Database Models & Relationships

### User Management

```python
# users/models.py
class User(AbstractUser):
    # Django's built-in User model
    # Fields: username, email, password, first_name, last_name

class UserProfile(models.Model):
    user = OneToOneField(User)
    user_type = CharField(choices=['vendor', 'customer'])
    first_name = CharField(max_length=100)
    last_name = CharField(max_length=100)
    phone = CharField(max_length=20)

class Address(models.Model):
    user = ForeignKey(User)
    address_type = CharField(choices=['shipping', 'billing', 'both'])
    street_address = CharField(max_length=255)
    city = CharField(max_length=100)
    state = CharField(max_length=100)
    postal_code = CharField(max_length=20)
    country = CharField(max_length=100)
    is_default = BooleanField(default=False)

class Wishlist(models.Model):
    user = ForeignKey(User)
    product = ForeignKey('vendors.VendorProduct')
    created_at = DateTimeField(auto_now_add=True)
```

### Vendor & Product Management

```python
# vendors/models.py
class Vendor(models.Model):
    user = OneToOneField(User)
    business_name = CharField(max_length=200)
    description = TextField(blank=True)
    phone = CharField(max_length=20)
    address = TextField()
    is_verified = BooleanField(default=False)
    created_at = DateTimeField(auto_now_add=True)

class VendorProduct(models.Model):
    vendor = ForeignKey(Vendor)
    category = ForeignKey('categories.Category')
    name = CharField(max_length=200)
    description = TextField()
    price = DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = PositiveIntegerField()
    sku = CharField(max_length=100, unique=True)
    is_active = BooleanField(default=True)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

class ProductImage(models.Model):
    product = ForeignKey(VendorProduct)
    image = ImageField(upload_to='products/')
    alt_text = CharField(max_length=200)
    is_primary = BooleanField(default=False)
```

### Shopping & Orders

```python
# cart/models.py
class Cart(models.Model):
    user = ForeignKey(User, null=True, blank=True)
    session_key = CharField(max_length=40, null=True, blank=True)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

class CartItem(models.Model):
    cart = ForeignKey(Cart)
    product = ForeignKey('vendors.VendorProduct')
    quantity = PositiveIntegerField(default=1)
    added_at = DateTimeField(auto_now_add=True)

# orders/models.py
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    user = ForeignKey(User)
    order_number = CharField(max_length=100, unique=True)
    status = CharField(max_length=20, choices=STATUS_CHOICES)
    total_amount = DecimalField(max_digits=10, decimal_places=2)
    shipping_address = TextField()
    created_at = DateTimeField(auto_now_add=True)

class OrderItem(models.Model):
    order = ForeignKey(Order)
    product = ForeignKey('vendors.VendorProduct')
    quantity = PositiveIntegerField()
    price = DecimalField(max_digits=10, decimal_places=2)
```

### Categories & Attributes

```python
# categories/models.py
class Category(models.Model):
    name = CharField(max_length=100)
    slug = SlugField(unique=True)
    parent = ForeignKey('self', null=True, blank=True)
    description = TextField(blank=True)
    is_active = BooleanField(default=True)

class AttributeGroup(models.Model):
    name = CharField(max_length=100)
    category = ForeignKey(Category)

class Attribute(models.Model):
    name = CharField(max_length=100)
    attribute_group = ForeignKey(AttributeGroup)
    attribute_type = CharField(choices=['text', 'number', 'boolean', 'select'])

class AttributeOption(models.Model):
    attribute = ForeignKey(Attribute)
    value = CharField(max_length=200)
```

---

## 📡 API Endpoints Reference

### API Request Flow Through Cloudflare

All API requests in this application are routed through Cloudflare tunnel:

```
Frontend (shop.bazro.ge:443) → Cloudflare Edge → Tunnel → Django (localhost:8000)
Admin (seller.bazro.ge:443) → Cloudflare Edge → Tunnel → Django (localhost:8000)
```

**Base URL**: `https://api.bazro.ge` (all frontends use this)

**Request Headers Required**:

```javascript
// For authenticated requests
headers: {
  'Authorization': `Bearer ${jwt_token}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

// For master token requests (internal)
headers: {
  'X-Master-Token': 'your-super-secret-token',
  'Content-Type': 'application/json'
}
```

**Environment Variables for API Calls**:

- Customer Frontend: `VITE_API_BASE_URL=https://api.bazro.ge`
- Admin Frontend: `VITE_API_BASE_URL=https://api.bazro.ge`
- Master Token: `VITE_MASTER_TOKEN=your-super-secret-token`

### Authentication Flow Through Cloudflare

1. **Login Request**:

   ```javascript
   POST https://api.bazro.ge/api/users/login/
   // Travels: shop.bazro.ge → Cloudflare → localhost:8000
   ```

2. **Token Storage**: JWT stored in localStorage/cookies
3. **Authenticated Requests**:

   ```javascript
   GET https://api.bazro.ge/api/users/profile/
   // Headers include: Authorization: Bearer {token}
   ```

4. **Token Refresh**:
   ```javascript
   POST https://api.bazro.ge/api/token/refresh/
   // Auto-handled by auth utilities
   ```

### Core Endpoints

**Production (via Cloudflare Tunnel)**:

```
Base URL: https://api.bazro.ge
Full endpoint: https://api.bazro.ge/api/{endpoint}

Request Flow:
Frontend (shop.bazro.ge) → Cloudflare → api.bazro.ge → localhost:8000
```

**Development (Local)**:

```
Base URL: http://localhost:8000
Full endpoint: http://localhost:8000/api/{endpoint}
```

**Important**: All frontend applications are configured to use the Cloudflare tunnel domain (`https://api.bazro.ge`) even during development. The tunnel routes traffic to the local Django server.

### Authentication & Headers

**JWT Authentication**:

```http
Authorization: Bearer <access_token>
```

**Master Token Authentication** (for system access):

```http
X-Master-Token: your-super-secret-token
```

**Standard Headers**:

```http
Content-Type: application/json
Accept: application/json
```

All API endpoints are prefixed with `/api/`

### Authentication Endpoints

```http
POST /api/users/register/          # User registration
POST /api/users/login/             # User login (username/email)
POST /api/users/login-or-register/ # Smart login/register
POST /api/token/refresh/           # JWT token refresh

# Social Authentication
GET  /api/users/auth/google/       # Google OAuth redirect
POST /api/users/auth/google/callback/  # Google OAuth callback
GET  /api/users/auth/facebook/     # Facebook OAuth redirect
POST /api/users/auth/facebook/callback/ # Facebook OAuth callback
```

### User Management

```http
GET    /api/users/profile/         # Get user profile
PUT    /api/users/profile/update/  # Update user profile
GET    /api/users/addresses/       # List user addresses
POST   /api/users/addresses/       # Create new address
PUT    /api/users/addresses/{id}/  # Update address
DELETE /api/users/addresses/{id}/  # Delete address
GET    /api/users/addresses/default/{type}/ # Get default address
POST   /api/users/addresses/default/{type}/ # Set default address

# Wishlist
GET    /api/users/wishlist/        # List wishlist items
POST   /api/users/wishlist/        # Add to wishlist
DELETE /api/users/wishlist/{id}/   # Remove from wishlist
```

### Product & Vendor Management

```http
GET    /api/vendors/               # List vendors
POST   /api/vendors/               # Create vendor (authenticated)
GET    /api/vendors/{id}/          # Get vendor details
PUT    /api/vendors/{id}/          # Update vendor
DELETE /api/vendors/{id}/          # Delete vendor

GET    /api/vendors/products/      # List all products
POST   /api/vendors/products/      # Create product
GET    /api/vendors/products/{id}/ # Get product details
PUT    /api/vendors/products/{id}/ # Update product
DELETE /api/vendors/products/{id}/ # Delete product
GET    /api/vendors/products/by-vendor/{vendor_id}/ # Vendor's products
```

### Shopping Cart

```http
GET    /api/cart/carts/current/    # Get current cart
POST   /api/cart/carts/add_item/   # Add item to cart
POST   /api/cart/carts/remove_item/ # Remove item from cart
POST   /api/cart/carts/merge_cart/ # Merge guest cart with user cart
GET    /api/cart/items/            # List cart items
PUT    /api/cart/items/{id}/       # Update cart item
DELETE /api/cart/items/{id}/       # Delete cart item
```

### Order Management

```http
GET    /api/orders/                # List user orders
POST   /api/orders/                # Create new order
GET    /api/orders/{id}/           # Get order details
PUT    /api/orders/{id}/           # Update order
GET    /api/orders/{id}/tracking/  # Get order tracking
POST   /api/orders/create_from_cart/ # Create order from cart
```

### Categories & Attributes

```http
GET    /api/categories/            # List categories
GET    /api/categories/root/       # Root categories only
GET    /api/categories/{slug}/     # Category details
GET    /api/categories/{slug}/detail/ # Category with attributes
GET    /api/categories/attribute-groups/ # List attribute groups
GET    /api/categories/attributes/ # List attributes
GET    /api/categories/attribute-options/ # List attribute options
```

### Payment & Shipping

```http
GET    /api/payments/              # List payments
POST   /api/payments/              # Process payment
POST   /api/payments/process/      # Process payment for order

GET    /api/payouts/               # List vendor payouts
POST   /api/payouts/               # Request payout

GET    /api/shipping/              # List shipments
POST   /api/shipping/              # Create shipment
GET    /api/shipping/{id}/         # Shipment details

GET    /api/reviews/               # List reviews
POST   /api/reviews/               # Create review
```

### Utility Endpoints

```http
GET    /api/endpoints/             # List all available endpoints
GET    /api/token-info/            # Get current token info
```

---

## 🔐 Authentication & Security

### Authentication Methods

#### 1. JWT Authentication (Primary)

```python
# Usage in requests
headers = {
    'Authorization': 'Bearer <access_token>',
    'Content-Type': 'application/json'
}
```

**Token Settings:**

- Access Token Lifetime: 30 minutes
- Refresh Token Lifetime: 1 day
- Auto-rotation enabled
- Blacklist support (if installed)

#### 2. Master Token Authentication

```python
# For frontend services
headers = {
    'X-Master-Token': 'your-super-secret-token',
    'Content-Type': 'application/json'
}
```

#### 3. Social OAuth (Google & Facebook)

**Flow:**

1. Frontend redirects to `/api/users/auth/google/` or `/api/users/auth/facebook/`
2. User completes OAuth on provider site
3. Provider redirects to callback URL with code
4. Frontend sends code to `/api/users/auth/{provider}/callback/`
5. Backend exchanges code for user info and returns JWT tokens

### Permission Classes

- `AllowAny()` - Public endpoints (registration, login, product listing)
- `IsAuthenticated()` - Requires valid JWT token
- `IsAdminUser()` - Admin-only operations
- Custom vendor permissions for vendor-specific operations

### Security Features

- CORS configuration for cross-origin requests
- CSRF protection
- SSL/HTTPS support in production
- Request/response logging middleware
- Password validation
- Session security

---

## 🎨 Frontend Structure

### Customer Frontend (`/frontend/`)

#### Main Components

```jsx
// App.jsx - Main application component
function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          // ... more routes
        </Routes>
      </Router>
    </AuthProvider>
  );
}
```

#### Context Providers

```jsx
// contexts/AuthContext.jsx
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const login = async (credentials) => {
    // Login logic with API call
  };

  const logout = () => {
    // Logout logic
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### API Services

```jsx
// services/api.js
import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Admin Frontend (`/frontend-admin/`)

Separate React application for vendor/admin management with similar structure but admin-focused components.

---

## ⚙️ Key Features & Business Logic

### Multi-Vendor System

- **Vendor Registration**: Users can register as vendors
- **Product Management**: Vendors manage their own products
- **Order Processing**: Orders split by vendor for fulfillment
- **Payout System**: Automatic payout calculations for vendors

### Shopping Cart Logic

```python
# cart/models.py - Cart persistence logic
class Cart(models.Model):
    @classmethod
    def get_or_create_cart(cls, user=None, session_key=None):
        if user and user.is_authenticated:
            cart, created = cls.objects.get_or_create(user=user)
        else:
            cart, created = cls.objects.get_or_create(session_key=session_key)
        return cart
```

**Cart Features:**

- Session-based cart for anonymous users
- User-based cart for authenticated users
- Cart merging when user logs in
- Persistent cart items

### Order Management Workflow

1. **Cart to Order**: Convert cart items to order items
2. **Payment Processing**: Handle payment through various methods
3. **Order Confirmation**: Send confirmation emails/notifications
4. **Fulfillment**: Track shipping and delivery
5. **Completion**: Mark order as delivered

### Product Categories & Attributes

- **Hierarchical Categories**: Parent-child category relationships
- **Dynamic Attributes**: Customizable product attributes per category
- **Attribute Groups**: Logical grouping of related attributes
- **Flexible Values**: Text, number, boolean, and select attribute types

---

## ☁️ Cloudflare Tunnel Configuration & Setup

### Overview

This project uses **Cloudflare Tunnel** to expose local development servers to the internet through the `bazro.ge` domain. This enables:

- Public access to local development environment
- HTTPS termination at Cloudflare edge
- Secure tunneling without port forwarding
- Domain-based routing for different services

### Domain Configuration

The project uses three main subdomains routed through Cloudflare Tunnel:

| Subdomain         | Local Port | Purpose               | Environment Variables                                   |
| ----------------- | ---------- | --------------------- | ------------------------------------------------------- |
| `api.bazro.ge`    | 8000       | Django Backend API    | `VITE_API_BASE_URL=https://api.bazro.ge`                |
| `shop.bazro.ge`   | 5173       | Customer Frontend     | `VITE_REDIRECT_URI=https://shop.bazro.ge/auth/callback` |
| `seller.bazro.ge` | 5174       | Vendor Admin Frontend | `VITE_API_BASE_URL=https://api.bazro.ge`                |

### Cloudflare Tunnel Setup

#### 1. Installation & Authentication

```bash
# Install cloudflared CLI
# Windows: Download from cloudflare.com
# macOS: brew install cloudflared
# Linux: Use provided .deb package

# Authenticate with Cloudflare
cloudflared tunnel login
```

#### 2. Tunnel Configuration

**File**: `cloudflared-config.yml`

```yaml
tunnel: f52cce30-c217-4260-9d7d-186a81b1e72c
credentials-file: C:/Users/Boris/.cloudflared/f52cce30-c217-4260-9d7d-186a81b1e72c.json

ingress:
  # Django Backend API
  - hostname: api.bazro.ge
    service: http://localhost:8000

  # Customer Frontend
  - hostname: shop.bazro.ge
    service: http://localhost:5173

  # Vendor Admin Frontend
  - hostname: seller.bazro.ge
    service: http://localhost:5174

  # Catch-all
  - service: http_status:404

originRequest:
  connectTimeout: 30s
  noTLSVerify: true
```

#### 3. DNS Configuration

DNS CNAME records in Cloudflare dashboard:

- `api.bazro.ge` → `f52cce30-c217-4260-9d7d-186a81b1e72c.cfargotunnel.com`
- `shop.bazro.ge` → `f52cce30-c217-4260-9d7d-186a81b1e72c.cfargotunnel.com`
- `seller.bazro.ge` → `f52cce30-c217-4260-9d7d-186a81b1e72c.cfargotunnel.com`

#### 4. Starting the Tunnel

```bash
# Start tunnel with configuration
cloudflared tunnel --config cloudflared-config.yml run django-multivendor

# Or use batch file
./cloudflare.bat
```

### Environment Variable Configuration

#### Frontend Customer (`/frontend/.env`)

```properties
VITE_API_BASE_URL=https://api.bazro.ge
VITE_MASTER_TOKEN=your-super-secret-token
VITE_REDIRECT_URI=https://shop.bazro.ge/auth/callback
VITE_OAUTH_PROTOCOL=https
```

#### Frontend Admin (`/frontend-admin/.env`)

```properties
VITE_API_BASE_URL=https://api.bazro.ge
VITE_MASTER_TOKEN=your-super-secret-token
VITE_REDIRECT_URI=https://shop.bazro.ge/auth/callback
VITE_OAUTH_PROTOCOL=https
VITE_API_URL=https://api.bazro.ge
```

### Django Backend Configuration for Cloudflare

**File**: `backend/django_multivendor/settings.py`

```python
# CORS configuration for Cloudflare domains
CORS_ALLOWED_ORIGINS = [
    'https://shop.bazro.ge',
    'https://seller.bazro.ge',
    'https://api.bazro.ge',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
]

# Allowed hosts for Cloudflare tunnel
ALLOWED_HOSTS = [
    'api.bazro.ge',
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
]

# Trust Cloudflare proxy headers
USE_TZ = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = False  # Cloudflare handles SSL termination
```

### Request Flow Architecture

```
Internet → Cloudflare Edge → Cloudflare Tunnel → Local Development Server
```

1. **Client Request**: User accesses `https://shop.bazro.ge`
2. **Cloudflare Edge**: Request hits Cloudflare's edge servers
3. **SSL Termination**: Cloudflare handles SSL/TLS termination
4. **Tunnel Routing**: Based on hostname, routes to appropriate local port
5. **Local Server**: Request reaches local development server (Django/React)
6. **Response Path**: Response travels back through tunnel to client

### API Request Routing

All API requests from both frontends are sent through the Cloudflare tunnel:

- **From Customer Frontend**: `https://shop.bazro.ge` → API calls to `https://api.bazro.ge`
- **From Admin Frontend**: `https://seller.bazro.ge` → API calls to `https://api.bazro.ge`
- **Direct API Access**: External tools can access `https://api.bazro.ge` directly

### Security Considerations

1. **Master Token**: Used for internal API authentication
2. **CORS**: Properly configured for all Cloudflare domains
3. **SSL/TLS**: Terminated at Cloudflare edge (end-to-end encryption)
4. **Authentication**: JWT tokens work seamlessly through tunnel
5. **Rate Limiting**: Cloudflare provides DDoS protection and rate limiting

### Development Workflow with Cloudflare

1. **Start Local Servers**:

   ```bash
   # Terminal 1: Django Backend
   cd backend && python manage.py runserver

   # Terminal 2: Customer Frontend
   cd frontend && npm run dev

   # Terminal 3: Admin Frontend
   cd frontend-admin && npm run dev

   # Terminal 4: Cloudflare Tunnel
   cloudflared tunnel --config cloudflared-config.yml run django-multivendor
   ```

2. **Access Applications**:

   - Customer frontend: `https://shop.bazro.ge`
   - Admin frontend: `https://seller.bazro.ge`
   - API documentation: `https://api.bazro.ge/api/`
   - Django admin: `https://api.bazro.ge/admin/`

3. **Testing**:
   - All API requests go through Cloudflare tunnel
   - Authentication works with real HTTPS URLs
   - Social OAuth redirects work properly
   - File uploads work through tunnel

### Troubleshooting Cloudflare Issues

1. **Tunnel Not Starting**:

   - Check credentials file path in config
   - Verify tunnel ID matches created tunnel
   - Ensure local servers are running

2. **DNS Not Resolving**:

   - Verify CNAME records in Cloudflare dashboard
   - Check tunnel status: `cloudflared tunnel list`
   - Wait for DNS propagation (up to 5 minutes)

3. **API Requests Failing**:

   - Check CORS configuration in Django settings
   - Verify `ALLOWED_HOSTS` includes Cloudflare domains
   - Check authentication headers through tunnel

4. **File Upload Issues**:
   - Increase `originRequest.connectTimeout` in config
   - Check Django file upload settings
   - Verify Content-Type headers pass through tunnel

---

## ⚙️ Configuration & Settings

### Cloudflare Tunnel Configuration (Production Deployment)

This project uses **Cloudflare Tunnel** to expose local development servers through secure tunnels to production domains. This setup allows the application to run locally while being accessible via public domains with SSL termination handled by Cloudflare.

#### Domain Configuration

```yaml
# Production domains via Cloudflare Tunnel:
# - api.bazro.ge     -> Backend Django API (localhost:8000)
# - shop.bazro.ge    -> Customer Frontend (localhost:5173)
# - seller.bazro.ge  -> Admin/Vendor Frontend (localhost:5174)
```

#### Cloudflare Tunnel Setup

**Installation**:

- Download `cloudflared` CLI from Cloudflare
- Authenticate: `cloudflared tunnel login`
- Create tunnel: `cloudflared tunnel create django-multivendor`

**Configuration File** (`cloudflared-config.yml`):

```yaml
tunnel: f52cce30-c217-4260-9d7d-186a81b1e72c
credentials-file: C:/Users/Boris/.cloudflared/f52cce30-c217-4260-9d7d-186a81b1e72c.json

ingress:
  # Route backend API traffic
  - hostname: api.bazro.ge
    service: http://localhost:8000

  # Route customer frontend traffic
  - hostname: shop.bazro.ge
    service: http://localhost:5173

  # Route vendor/admin frontend traffic
  - hostname: seller.bazro.ge
    service: http://localhost:5174

  # Catch-all rule
  - service: http_status:404

originRequest:
  connectTimeout: 30s
  noTLSVerify: true
```

**DNS Configuration**: Create CNAME records in Cloudflare DNS:

- `api.bazro.ge` → `f52cce30-c217-4260-9d7d-186a81b1e72c.cfargotunnel.com`
- `shop.bazro.ge` → `f52cce30-c217-4260-9d7d-186a81b1e72c.cfargotunnel.com`
- `seller.bazro.ge` → `f52cce30-c217-4260-9d7d-186a81b1e72c.cfargotunnel.com`

**Starting the Tunnel**:

```bash
# Manual start
cloudflared tunnel --config cloudflared-config.yml run django-multivendor

# Using batch file (Windows)
./cloudflare.bat
```

### Environment Variable Configuration

#### Frontend Customer (`.env`)

```properties
VITE_API_BASE_URL=https://api.bazro.ge
VITE_MASTER_TOKEN=your-super-secret-token
VITE_REDIRECT_URI=https://shop.bazro.ge/auth/callback
VITE_OAUTH_PROTOCOL=https
```

#### Frontend Admin (`.env`)

```properties
VITE_API_BASE_URL=https://api.bazro.ge
VITE_MASTER_TOKEN=your-super-secret-token
VITE_REDIRECT_URI=https://shop.bazro.ge/auth/callback
VITE_OAUTH_PROTOCOL=https
VITE_API_URL=https://api.bazro.ge
```

#### Development Override (`.env.development`)

```bash
VITE_API_URL=https://api.bazro.ge
```

### API Request Routing

**Important**: All API requests are routed through the Cloudflare tunnel:

```javascript
// Frontend API configuration
const API_URL = "https://api.bazro.ge"; // Always use tunnel domain

// All requests go through Cloudflare:
// Frontend (shop.bazro.ge) -> Cloudflare -> api.bazro.ge -> localhost:8000
```

### Backend CORS & Security Configuration

```python
# django_multivendor/settings.py - Key settings

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# JWT Configuration
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'UPDATE_LAST_LOGIN': True,
}

# CORS Settings
CORS_ALLOW_ALL_ORIGINS = True  # Development only
CORS_ALLOWED_ORIGINS = [
    'https://localhost:5173',
    'http://localhost:5173',
    'https://shop.bazro.ge',
    # ... production domains
]

# Social Auth
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = 'your-google-client-id'
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = 'your-google-client-secret'
SOCIAL_AUTH_FACEBOOK_KEY = 'your-facebook-app-id'
SOCIAL_AUTH_FACEBOOK_SECRET = 'your-facebook-app-secret'

# Master Token
MASTER_ACCESS_TOKEN = 'your-super-secret-token'
```

### Frontend Environment

```bash
# frontend/.env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_FACEBOOK_APP_ID=your-facebook-app-id
```

---

## 🛠️ Development Workflow

### Production Deployment (Cloudflare Tunnel)

**Complete Development Setup**:

```bash
# 1. Start Backend (Terminal 1)
cd backend
python manage.py runserver 8000

# 2. Start Customer Frontend (Terminal 2)
cd frontend
npm run dev -- --port 5173

# 3. Start Admin Frontend (Terminal 3)
cd frontend-admin
npm run dev -- --port 5174

# 4. Start Cloudflare Tunnel (Terminal 4)
cloudflared tunnel --config cloudflared-config.yml run django-multivendor
# OR use the batch file
./cloudflare.bat
```

**Access Points**:

- **Customer Frontend**: https://shop.bazro.ge
- **Admin/Vendor Frontend**: https://seller.bazro.ge
- **API/Django Admin**: https://api.bazro.ge/admin/
- **Local Django**: http://localhost:8000 (direct access)

**Development Benefits**:

- SSL handled by Cloudflare (no local certificates needed)
- Public URLs for testing on mobile devices
- Real production-like environment
- Share development links with team/clients

### Local Development (Without Tunnel)

### Backend Development

```bash
# Setup
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic

# Development server
python manage.py runserver
# or with SSL
python run_ssl.py
```

### Frontend Development

```bash
# Customer frontend
cd frontend
npm install
npm run dev

# Admin frontend
cd frontend-admin
npm install
npm run dev
```

### Database Migrations

```bash
# Create migration
python manage.py makemigrations app_name

# Apply migrations
python manage.py migrate

# Show migration status
python manage.py showmigrations
```

### Testing API Endpoints

```bash
# List all endpoints
curl http://localhost:8000/api/endpoints/

# Test authentication
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"user@example.com","password":"password123"}'

# Test authenticated endpoint
curl -X GET http://localhost:8000/api/users/profile/ \
  -H "Authorization: Bearer <your-token>"
```

---

## 💻 Common Patterns & Code Examples

### API View Pattern

```python
# Standard ViewSet pattern
class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return VendorProduct.objects.filter(vendor__user=self.request.user)

    def perform_create(self, serializer):
        vendor = get_object_or_404(Vendor, user=self.request.user)
        serializer.save(vendor=vendor)

    @action(detail=False, methods=['get'])
    def my_products(self, request):
        products = self.get_queryset()
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
```

### Custom Authentication

```python
# vendors/authentication.py
class MasterTokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token = request.META.get('HTTP_X_MASTER_TOKEN')
        if token and token == settings.MASTER_ACCESS_TOKEN:
            return (None, token)  # Anonymous user with token
        return None
```

### Serializer Pattern

```python
# Nested serializer with validation
class UserSerializer(serializers.ModelSerializer):
    userprofile = UserProfileSerializer(required=False)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'userprofile']

    def create(self, validated_data):
        profile_data = validated_data.pop('userprofile', {})
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user, **profile_data)
        return user
```

### Frontend API Integration

```jsx
// React API integration pattern
const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/vendors/products/");
        setProducts(response.data.results || response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading };
};
```

### Error Handling Pattern

```python
# Consistent error handling
class CustomAPIView(APIView):
    def handle_exception(self, exc):
        if isinstance(exc, ValidationError):
            return Response(
                {'error': 'Validation failed', 'details': exc.detail},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().handle_exception(exc)
```

---

## 🚨 Troubleshooting Guide

### Cloudflare Tunnel Issues

#### 1. Tunnel Connection Problems

**Problem**: `cloudflared` won't start or connect
**Solutions:**

```bash
# Check tunnel status
cloudflared tunnel info django-multivendor

# Verify configuration file
cloudflared tunnel --config cloudflared-config.yml validate

# Test local services
curl http://localhost:8000/api/
curl http://localhost:5173
curl http://localhost:5174

# Manual tunnel start with debug
cloudflared tunnel --config cloudflared-config.yml --loglevel debug run django-multivendor
```

#### 2. DNS Resolution Issues

**Problem**: Domains not resolving to tunnel
**Solutions:**

- Verify CNAME records in Cloudflare DNS panel
- Check tunnel ID matches in config and DNS
- Wait for DNS propagation (up to 48 hours)
- Test with `nslookup` or `dig`:

```bash
nslookup api.bazro.ge
nslookup shop.bazro.ge
nslookup seller.bazro.ge
```

#### 3. SSL/HTTPS Issues

**Problem**: SSL errors or mixed content warnings
**Solutions:**

- Ensure all API calls use `https://api.bazro.ge`
- Check CORS settings allow HTTPS origins
- Verify Cloudflare SSL mode is "Full" or "Full (strict)"
- Update frontend environment variables:

```properties
# Ensure all URLs use HTTPS
VITE_API_BASE_URL=https://api.bazro.ge
VITE_OAUTH_PROTOCOL=https
```

#### 4. API Request Routing Problems

**Problem**: 404 or connection errors to API
**Solutions:**

- Verify Django is running on port 8000
- Check ingress rules in `cloudflared-config.yml`
- Test direct local access: `http://localhost:8000/api/users/profile/`
- Restart tunnel after config changes

#### 5. Frontend Not Loading Through Tunnel

**Problem**: React apps not accessible via tunnel domains
**Solutions:**

```bash
# Ensure React apps bind to correct ports
cd frontend
npm run dev -- --host 0.0.0.0 --port 5173

cd frontend-admin
npm run dev -- --host 0.0.0.0 --port 5174

# Check Vite configuration
# vite.config.js
export default {
  server: {
    host: '0.0.0.0',
    port: 5173
  }
}
```

#### 6. Environment Variable Issues

**Problem**: Wrong API endpoints or configuration
**Solutions:**

- Verify `.env` files in both frontend apps
- Check environment variable loading:

```javascript
// Debug in browser console
console.log("API URL:", import.meta.env.VITE_API_BASE_URL);
console.log("Master Token:", import.meta.env.VITE_MASTER_TOKEN);
```

- Restart dev servers after environment changes

### Common Issues & Solutions

#### 1. JWT Token Issues

**Problem**: "Invalid token" or token expiration errors
**Solutions:**

- Check token expiration in JWT settings
- Implement token refresh logic in frontend
- Verify token format in Authorization header
- Check if blacklist app is properly configured

```python
# Debug token issues
def debug_token(request):
    token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[-1]
    try:
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        return decoded
    except jwt.ExpiredSignatureError:
        return "Token expired"
    except jwt.InvalidTokenError as e:
        return f"Invalid token: {e}"
```

#### 2. CORS Issues

**Problem**: Cross-origin requests blocked
**Solutions:**

- Add frontend domain to `CORS_ALLOWED_ORIGINS`
- Include required headers in `CORS_ALLOW_HEADERS`
- Check middleware order in settings

```python
# CORS debugging
CORS_ALLOW_ALL_ORIGINS = True  # Only for development
CORS_ALLOW_CREDENTIALS = True
CORS_EXPOSE_HEADERS = ['Content-Type', 'X-CSRFToken']
```

#### 3. Social Authentication Issues

**Problem**: OAuth redirects failing
**Solutions:**

- Verify redirect URIs match exactly in provider settings
- Check HTTPS requirements for production
- Validate client IDs and secrets
- Review OAuth scopes and permissions

#### 4. Database Migration Issues

**Problem**: Migration conflicts or failures
**Solutions:**

```bash
# Reset migrations (development only)
python manage.py migrate app_name zero
python manage.py makemigrations app_name
python manage.py migrate

# Fix migration conflicts
python manage.py migrate --fake app_name migration_number
```

#### 5. Cart Session Issues

**Problem**: Cart not persisting for anonymous users
**Solutions:**

- Ensure session middleware is properly configured
- Check session backend settings
- Verify cart session key generation

```python
# Debug cart sessions
def debug_cart_session(request):
    if not request.session.session_key:
        request.session.create()
    return f"Session key: {request.session.session_key}"
```

#### 6. File Upload Issues

**Problem**: Product images not uploading
**Solutions:**

- Check `MEDIA_URL` and `MEDIA_ROOT` settings
- Verify file permissions on media directory
- Ensure proper URL configuration for media files

```python
# settings.py
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# urls.py
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

### Debugging Tools

#### 1. Logging Configuration

```python
# Enhanced logging for debugging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'debug.log',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
        },
        'your_app': {
            'handlers': ['file', 'console'],
            'level': 'DEBUG',
        },
    },
}
```

#### 2. API Testing Commands

```bash
# Test endpoint availability
curl -I http://localhost:8000/api/endpoints/

# Test authentication
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test@example.com","password":"testpass123"}'

# Test protected endpoint
curl -X GET http://localhost:8000/api/users/profile/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 3. Database Inspection

```python
# Django shell debugging
python manage.py shell

# In shell:
from django.contrib.auth.models import User
from users.models import UserProfile
from vendors.models import VendorProduct

# Check user count
User.objects.count()

# Check latest products
VendorProduct.objects.order_by('-created_at')[:5]

# Debug cart issues
from cart.models import Cart
Cart.objects.filter(user__isnull=True)  # Anonymous carts
```

---

## 📚 Additional Resources

### API Documentation Files

- `/backend/docs/README_api.md` - Main API documentation
- `/backend/docs/users-api.md` - User endpoints documentation
- `/backend/docs/app-overview.md` - Application overview

### Development Scripts

- `/backend/run_ssl.py` - Development server with SSL
- `/backend/manage.py` - Django management commands

### Configuration Examples

- Frontend environment files for different environments
- Docker configuration (if available)
- Production deployment guides

---

## 🎯 Best Practices for LLMs

When working with this codebase:

1. **Always check authentication requirements** before suggesting API calls
2. **Use appropriate permission classes** for new endpoints
3. **Follow the established serializer patterns** for data validation
4. **Implement proper error handling** in views and frontend
5. **Maintain consistency** with existing naming conventions
6. **Test both authenticated and anonymous user flows**
7. **Consider vendor permissions** when dealing with product/order operations
8. **Use the established middleware** for logging and CORS
9. **Follow the cart session management patterns** for anonymous users
10. **Implement proper frontend state management** using the existing context patterns

This documentation provides a comprehensive overview of the Django multivendor e-commerce platform architecture, enabling LLMs to understand and work effectively with the codebase.

---

## Cloudflare & Deployment Files

- `cloudflared-config.yml` - Cloudflare tunnel configuration
- `cloudflare-tunnel-setup.md` - Setup documentation for Cloudflare tunnel
- `cloudflare.bat` - Windows batch script to start tunnel
- `cloudflared.deb` - Debian package for cloudflared installation
- `start.bat` - Combined startup script for all services

### Environment Configuration Files

- `frontend/.env` - Customer frontend environment variables
- `frontend-admin/.env` - Admin frontend environment variables
- `backend/django_multivendor/settings.py` - Django configuration with Cloudflare support

### Development & Production Deployment

**Local Development with Cloudflare Tunnel**:

1. All services run locally on different ports
2. Cloudflare tunnel exposes them via subdomains
3. Real HTTPS URLs for testing OAuth and webhooks
4. No need for port forwarding or ngrok

**File Structure for Cloudflare Setup**:

```
project_root/
├── cloudflared-config.yml      # Tunnel configuration
├── cloudflare-tunnel-setup.md  # Setup instructions
├── cloudflare.bat             # Tunnel startup script
├── start.bat                  # Combined startup for all services
├── frontend/.env              # shop.bazro.ge config
├── frontend-admin/.env        # seller.bazro.ge config
└── backend/
    └── django_multivendor/
        └── settings.py         # CORS & ALLOWED_HOSTS for Cloudflare
```

**Environment Variables Mapping**:

```
Local Development:
- Django: localhost:8000 → https://api.bazro.ge
- Customer Frontend: localhost:5173 → https://shop.bazro.ge
- Admin Frontend: localhost:5174 → https://seller.bazro.ge

Production:
- Same URLs, but services run on production servers
- Cloudflare tunnel replaced with direct hosting
```
