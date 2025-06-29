# Test Suite Documentation

This directory contains all tests for the Django Multivendor platform.

## Directory Structure

```
tests/
├── jwt_auth/           # JWT Authentication & Token Refresh Tests
├── api/               # API Endpoint Tests
├── websocket/         # WebSocket & Real-time Tests
└── README.md          # This file
```

## JWT Authentication Tests (`jwt_auth/`)

### Essential Files

- **`debug_tokens.py`** - Main JWT test script (WORKING)

  - Tests login with multiple accounts
  - Analyzes token structure and payloads
  - Tests immediate token refresh
  - **Usage**: `python tests/jwt_auth/debug_tokens.py`

- **`comprehensive_jwt_test.py`** - Full test suite
  - Multiple refresh cycles test
  - Error handling verification
  - Token rotation testing
  - **Usage**: `python tests/jwt_auth/comprehensive_jwt_test.py [--quick|--cycles]`

### Utility Files

- **`check_users.py`** - Database user verification utility
- **`check_blacklist.py`** - Token blacklist status checker

## API Tests (`api/`)

- **`test_vendor_orders.py`** - Vendor order management API tests
- **`test_ai_search.py`** - AI search functionality tests
- **`test_search_apis.py`** - General search API tests

## WebSocket Tests (`websocket/`)

- **`test_websocket.py`** - Real-time WebSocket connection tests

## Running Tests

### Quick JWT Test

```bash
cd tests/jwt_auth
python debug_tokens.py
```

### Full JWT Test Suite

```bash
cd tests/jwt_auth
python comprehensive_jwt_test.py
```

### Specific API Tests

```bash
cd tests/api
python test_vendor_orders.py
```

## Test Results

- ✅ JWT Token Refresh: **WORKING** (Fixed BLACKLIST_AFTER_ROTATION issue)
- ✅ Login Endpoints: **WORKING**
- ✅ Token Rotation: **WORKING**
- ✅ Enhanced Error Responses: **WORKING**

## Recent Fixes

**2025-06-29**: Fixed JWT refresh token issue

- **Root Cause**: `BLACKLIST_AFTER_ROTATION: True` was blacklisting tokens immediately upon use
- **Solution**: Set `BLACKLIST_AFTER_ROTATION: False` in JWT settings
- **Result**: Token refresh now works correctly for both immediate refresh and rotation cycles

## Configuration

JWT settings are configured in `backend/django_multivendor/settings.py`:

```python
SIMPLE_JWT = {
    'ROTATE_REFRESH_TOKENS': True,           # ✅ Enabled
    'BLACKLIST_AFTER_ROTATION': False,      # ⚠️ Disabled to fix refresh issue
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}
```
