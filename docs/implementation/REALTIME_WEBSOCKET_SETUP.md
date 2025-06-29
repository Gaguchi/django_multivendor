# Real-Time WebSocket Order Updates - Setup & Testing

## Overview

This implementation adds real-time WebSocket support to the vendor order management system, enabling instant status updates without page reloads.

## Features Implemented

### Backend (Django Channels)

- **WebSocket Support**: Added Django Channels with Redis channel layer
- **Order Notifications**: Real-time notifications when order status changes
- **Vendor-Specific Channels**: Each vendor gets their own WebSocket channel
- **Heartbeat System**: Ping/pong to maintain connection health

### Frontend (React)

- **WebSocket Service**: Robust WebSocket client with reconnection logic
- **Real-Time Context**: React context for managing WebSocket state
- **Status Integration**: Orders update instantly via WebSocket
- **Notifications UI**: Toast-style notifications for order updates
- **Connection Status**: Visual indicators for WebSocket connection state

## Setup Instructions

### 1. Install Dependencies

```bash
# Backend dependencies (already installed)
cd backend
pip install channels channels-redis

# Install Redis (required for channel layers)
# Windows: Download from https://redis.io/download
# Ubuntu: sudo apt install redis-server
# macOS: brew install redis
```

### 2. Start Redis Server

```bash
# Start Redis server
redis-server

# Or on Windows with Redis installer, start the Redis service
```

### 3. Start Django with ASGI Support

```bash
cd backend

# Option 1: Use Django's built-in ASGI server (development)
python manage.py runserver

# Option 2: Use Daphne for better WebSocket support
pip install daphne
daphne -b 0.0.0.0 -p 8000 django_multivendor.asgi:application
```

### 4. Test the WebSocket Connection

1. Open the vendor dashboard in your browser
2. Navigate to the Orders page
3. Look for the "Real-time: ON" indicator in the status bar
4. Try updating an order status and watch for instant updates

## How It Works

### Real-Time Flow

1. **Vendor logs in** → WebSocket connection established
2. **Order status updated** → Backend sends WebSocket notification
3. **Frontend receives update** → UI updates instantly
4. **Polling frequency reduced** → Less server load when WebSocket is active

### Fallback System

- If WebSocket connection fails, polling continues at normal intervals
- If WebSocket disconnects, automatic reconnection with exponential backoff
- System gracefully handles connection issues

## Configuration

### WebSocket Settings (settings.py)

```python
# Channel Layers Configuration
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("127.0.0.1", 6379)],
        },
    },
}
```

### Frontend WebSocket URL

The WebSocket connects to: `ws://api.bazro.ge/ws/vendor/{vendor_id}/orders/`

## Testing Order Updates

### Manual Testing

1. Open vendor dashboard
2. Open browser developer tools (Network tab)
3. Look for WebSocket connection
4. Update an order status via the API or admin
5. Watch for real-time update in the UI

### API Testing

```bash
# Update order status via API (this should trigger WebSocket notification)
curl -X POST http://api.bazro.ge/api/orders/{order_number}/update-status/ \
  -H "X-Master-Token: your-master-token" \
  -H "X-Vendor-ID: vendor-id" \
  -H "Content-Type: application/json" \
  -d '{"status": "Shipped"}'
```

## Troubleshooting

### WebSocket Won't Connect

1. Ensure Redis is running: `redis-cli ping` should return "PONG"
2. Check Django server is running with ASGI support
3. Verify CORS settings allow WebSocket connections
4. Check browser console for WebSocket errors

### Real-Time Updates Not Working

1. Check WebSocket connection status in the UI
2. Verify vendor ID is correctly set
3. Test with browser developer tools
4. Check Django logs for WebSocket consumer errors

### Performance Issues

1. Monitor Redis memory usage
2. Check WebSocket connection limits
3. Verify polling is reduced when WebSocket is active

## Files Modified/Added

### Backend

- `backend/requirements.txt` - Added channels dependencies
- `backend/django_multivendor/settings.py` - Channel layers config
- `backend/django_multivendor/asgi.py` - ASGI application setup
- `backend/orders/routing.py` - WebSocket URL routing
- `backend/orders/consumers.py` - WebSocket consumer
- `backend/orders/notifications.py` - Notification utilities
- `backend/orders/views.py` - Added WebSocket notifications to status updates

### Frontend

- `vendor_dashboard/src/services/websocket.js` - WebSocket service
- `vendor_dashboard/src/contexts/WebSocketContext.jsx` - WebSocket React context
- `vendor_dashboard/src/contexts/VendorOrderContext.jsx` - Added WebSocket integration
- `vendor_dashboard/src/components/Orders/PollingStatus.jsx` - Added WebSocket status
- `vendor_dashboard/src/components/Orders/RealTimeNotifications.jsx` - Notification UI
- `vendor_dashboard/src/pages/Orders.jsx` - Added notifications component
- `vendor_dashboard/src/App.jsx` - Added WebSocketProvider

## Next Steps

1. **Production Deployment**: Use proper ASGI server (Daphne/Uvicorn) with load balancing
2. **Monitoring**: Add WebSocket connection metrics and logging
3. **Security**: Implement proper WebSocket authentication
4. **Scalability**: Consider WebSocket connection limits and Redis clustering
5. **Testing**: Add automated tests for WebSocket functionality

## Benefits

- **Instant Updates**: No more waiting for polling intervals
- **Better UX**: Real-time feedback for order status changes
- **Reduced Load**: Lower polling frequency when WebSocket is active
- **Scalable**: Redis channel layer supports multiple servers
- **Reliable**: Automatic reconnection and fallback to polling
