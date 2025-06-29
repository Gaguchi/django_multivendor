# JWT Authentication Documentation

This directory contains all documentation related to JWT authentication and token refresh functionality.

## Files

### Implementation Documentation

- **[JWT_REFRESH_IMPLEMENTATION_PLAN.md](JWT_REFRESH_IMPLEMENTATION_PLAN.md)** - Complete implementation plan for JWT token refresh
- **[JWT_REFRESH_TESTING_PLAN.md](JWT_REFRESH_TESTING_PLAN.md)** - Testing strategy and test cases

## Quick Reference

### Current Status: ✅ WORKING

As of 2025-06-29, JWT token refresh is fully functional:

- ✅ **Login**: Working with multiple test accounts
- ✅ **Token Refresh**: Working correctly
- ✅ **Token Rotation**: Enabled and working
- ✅ **Error Handling**: Enhanced error responses implemented
- ✅ **Rate Limiting**: Implemented in EnhancedTokenRefreshView

### Key Configuration

```python
# backend/django_multivendor/settings.py
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': False,  # Fixed: was causing immediate blacklisting
    'UPDATE_LAST_LOGIN': True,
}
```

### Test Accounts

```python
test_accounts = [
    {"username": "testvendor@bazro.ge", "password": "Test123!"},
    {"username": "vendor@example.com", "password": "vendorpass123"},
    {"username": "admin2", "password": "admin2password"}
]
```

### API Endpoints

- **Login**: `POST /api/token/`
- **Refresh**: `POST /api/token/refresh/`
- **Enhanced Refresh**: Uses `EnhancedTokenRefreshView` with rate limiting and detailed error responses

### Recent Fix (2025-06-29)

**Problem**: Token refresh was failing immediately after login with "invalid_refresh_token" error.

**Root Cause**: `BLACKLIST_AFTER_ROTATION: True` was blacklisting refresh tokens immediately upon use.

**Solution**: Set `BLACKLIST_AFTER_ROTATION: False` to allow proper token refresh while maintaining rotation.

**Result**: Token refresh now works correctly for both immediate refresh and multiple refresh cycles.

## Testing

Run JWT tests with:

```bash
# Quick test
cd tests/jwt_auth
python debug_tokens.py

# Comprehensive test
python comprehensive_jwt_test.py

# Using test runner
cd tests
python test_runner.py --jwt
```

## Frontend Integration

The frontend should use the enhanced token manager:

```javascript
// Use enhancedAuth.js for token management
import { tokenManager } from "./utils/enhancedAuth.js";
import { apiService } from "./services/enhancedApi.js";

// API calls automatically handle token refresh
const response = await apiService.get("/api/vendors/orders/");
```

## Security Notes

1. **Access tokens**: Short-lived (15 minutes) for security
2. **Refresh tokens**: Longer-lived (7 days) for user convenience
3. **Token rotation**: New refresh token provided with each refresh
4. **Rate limiting**: 10 requests per minute per IP for refresh endpoint
5. **HTTPS**: All token exchanges should use HTTPS in production
