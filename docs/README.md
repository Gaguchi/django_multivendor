# Django Multivendor Documentation

Comprehensive documentation for the Django Multivendor e-commerce platform.

## Directory Structure

```
docs/
├── authentication/          # JWT Auth & Token Refresh
├── api/                    # API Documentation
├── implementation/         # Feature Implementation Guides
├── testing/               # Testing Documentation
├── LLM_DOCUMENTATION.md   # LLM Integration Guide
└── README.md              # This file
```

## Quick Navigation

### 🔐 Authentication

- **[JWT Authentication](authentication/)** - Token refresh, login, security
- **Status**: ✅ Working (Fixed 2025-06-29)

### 🛍️ Core Features

- **[Vendor Order Management](implementation/VENDOR_ORDER_MANAGEMENT.md)** - Order lifecycle, permissions
- **[Real-time WebSocket Setup](implementation/REALTIME_WEBSOCKET_SETUP.md)** - Live order updates
- **[AI Search Documentation](implementation/AI_SEARCH_DOCUMENTATION.md)** - Intelligent product search

### 🧪 Testing

- **[JWT Testing Plan](testing/JWT_REFRESH_TESTING_PLAN.md)** - Authentication test strategy
- **[Test Suite](../tests/)** - Automated test suite with runner

### 🔧 API Reference

- **[Backend API Docs](../backend/docs/)** - Complete API documentation
- **[API Testing](../tests/api/)** - API endpoint tests

## Recent Updates

### 2025-06-29: JWT Token Refresh Fixed ✅

- **Issue**: Refresh tokens failing immediately after login
- **Root Cause**: `BLACKLIST_AFTER_ROTATION` blacklisting tokens too early
- **Solution**: Adjusted JWT settings to allow proper refresh cycles
- **Status**: Fully working with comprehensive test coverage

### Key Features Working:

- ✅ User login with multiple authentication methods
- ✅ JWT token refresh with rotation
- ✅ Enhanced error handling and rate limiting
- ✅ Vendor order management with proper permissions
- ✅ API endpoint authentication
- ✅ Frontend token management integration

## Development Status

| Component           | Status      | Notes                                      |
| ------------------- | ----------- | ------------------------------------------ |
| JWT Authentication  | ✅ Working  | Fixed refresh token issue                  |
| API Endpoints       | ✅ Working  | All core endpoints tested                  |
| Vendor Dashboard    | ✅ Working  | React frontend with auth integration       |
| WebSocket Real-time | ⚠️ Optional | Can be re-enabled after auth stabilization |
| AI Search           | ✅ Working  | Integrated and tested                      |
| Order Management    | ✅ Working  | Vendor permissions enforced                |

## Getting Started

1. **Run Tests**: `cd tests && python test_runner.py --all`
2. **Check Auth**: `cd tests && python test_runner.py --jwt`
3. **Start Backend**: `cd backend && python manage.py runserver`
4. **Start Frontend**: `cd vendor_dashboard && npm run dev`

## Architecture

```
Frontend (React)
    ↓ (HTTPS/WSS)
Backend (Django + DRF)
    ↓ (Database)
PostgreSQL/SQLite
```

### Authentication Flow

```
Login → JWT Tokens → API Requests → Auto-refresh → Continue
```

### Vendor Order Flow

```
Vendor Login → Dashboard → Orders List → Real-time Updates → Order Management
```

## Configuration

Key settings in `backend/django_multivendor/settings.py`:

```python
# JWT Configuration (✅ Working)
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': False,  # Fixed: prevents immediate blacklisting
}

# CORS for Frontend
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://shop.bazro.ge",
]
```

## Support

For issues or questions:

1. Check the relevant documentation section
2. Run the test suite to verify functionality
3. Check the implementation guides for detailed setup instructions
