#!/usr/bin/env python
"""
Test script for WebSocket real-time order updates
"""
import os
import sys
import django
import asyncio
import websockets
import json

# Setup Django
sys.path.insert(0, '/e/Work/WebDev/django_multivendor/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_multivendor.settings')
django.setup()

from orders.models import Order
from vendors.models import Vendor
from orders.notifications import send_order_status_update

def test_websocket_notification():
    """Test sending a WebSocket notification"""
    try:
        # Get a vendor and order to test with
        vendor = Vendor.objects.first()
        order = Order.objects.first()
        
        if not vendor or not order:
            print("❌ No vendor or order found in database")
            print("Please create some test data first")
            return False
            
        print(f"📦 Testing WebSocket notification for vendor {vendor.id} and order {order.order_number}")
        
        # Send a test notification
        send_order_status_update(order, vendor.id)
        
        print("✅ WebSocket notification sent successfully!")
        print(f"Check your vendor dashboard for real-time updates")
        print(f"Vendor ID: {vendor.id}")
        print(f"Order: {order.order_number}")
        print(f"Status: {order.status}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

async def test_websocket_connection():
    """Test WebSocket connection"""
    try:
        vendor = Vendor.objects.first()
        if not vendor:
            print("❌ No vendor found in database")
            return False
            
        # Try to connect to WebSocket
        uri = f"ws://localhost:8000/ws/vendor/{vendor.id}/orders/"
        print(f"🔌 Attempting to connect to: {uri}")
        
        async with websockets.connect(uri) as websocket:
            print("✅ WebSocket connection established!")
            
            # Send a ping
            await websocket.send(json.dumps({
                "type": "ping",
                "timestamp": "2023-01-01T00:00:00Z"
            }))
            
            # Wait for response
            response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
            data = json.loads(response)
            
            if data.get('type') == 'pong':
                print("✅ WebSocket ping/pong successful!")
                return True
            else:
                print(f"❓ Unexpected response: {data}")
                return False
                
    except Exception as e:
        print(f"❌ WebSocket connection failed: {e}")
        print("Make sure Django channels server is running")
        return False

if __name__ == "__main__":
    print("🧪 Testing WebSocket Real-Time Order Updates")
    print("=" * 50)
    
    # Test 1: Notification sending
    print("\n1. Testing notification system...")
    notification_success = test_websocket_notification()
    
    # Test 2: WebSocket connection (requires server to be running)
    print("\n2. Testing WebSocket connection...")
    print("Note: This requires the Django server to be running with ASGI")
    try:
        connection_success = asyncio.run(test_websocket_connection())
    except Exception as e:
        print(f"❌ Connection test failed: {e}")
        connection_success = False
    
    print("\n" + "=" * 50)
    print("📊 Test Results:")
    print(f"  Notification System: {'✅ PASS' if notification_success else '❌ FAIL'}")
    print(f"  WebSocket Connection: {'✅ PASS' if connection_success else '❌ FAIL'}")
    
    if notification_success and connection_success:
        print("\n🎉 All tests passed! Real-time updates should work.")
    elif notification_success:
        print("\n⚠️  Notifications work, but WebSocket connection failed.")
        print("   Make sure to run the server with: python manage.py runserver")
    else:
        print("\n❌ Tests failed. Check the error messages above.")
