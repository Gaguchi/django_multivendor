#!/usr/bin/env python3
"""
Test script for WebSocket real-time notifications
This script sends test notifications via WebSocket to verify the real-time notification system
"""

import asyncio
import websockets
import json
import sys
import os

# Add the backend directory to the path to import Django models
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_multivendor.settings')

import django
django.setup()

from django.contrib.auth import get_user_model
from vendors.models import Vendor
from notifications.models import Notification

User = get_user_model()

async def send_test_notification(vendor_id):
    """Send a test notification via WebSocket"""
    
    # WebSocket URL (adjust based on your configuration)
    websocket_url = f"ws://localhost:8000/ws/vendor/{vendor_id}/orders/"
    
    try:
        async with websockets.connect(websocket_url) as websocket:
            print(f"Connected to WebSocket for vendor {vendor_id}")
            
            # Create a test notification in the database first
            vendor = Vendor.objects.get(id=vendor_id)
            notification = Notification.objects.create(
                recipient=vendor.user,
                title="Real-time Test Notification",
                message="This is a test notification sent via WebSocket to verify real-time updates.",
                type="info",
                priority="medium"
            )
            
            # Send the notification data via WebSocket
            notification_data = {
                "type": "new_notification",
                "data": {
                    "id": notification.id,
                    "title": notification.title,
                    "message": notification.message,
                    "type": notification.type,
                    "priority": notification.priority,
                    "is_read": notification.is_read,
                    "created_at": notification.created_at.isoformat(),
                    "vendor_id": vendor_id
                }
            }
            
            await websocket.send(json.dumps(notification_data))
            print(f"✅ Sent test notification: {notification.title}")
            
            # Test notification update
            await asyncio.sleep(2)
            
            notification.message = "This notification has been updated via WebSocket!"
            notification.save()
            
            update_data = {
                "type": "notification_update",
                "data": {
                    "id": notification.id,
                    "title": notification.title,
                    "message": notification.message,
                    "type": notification.type,
                    "priority": notification.priority,
                    "is_read": notification.is_read,
                    "updated_at": notification.updated_at.isoformat(),
                    "vendor_id": vendor_id
                }
            }
            
            await websocket.send(json.dumps(update_data))
            print(f"✅ Sent notification update: {notification.title}")
            
    except Exception as e:
        print(f"❌ Error connecting to WebSocket: {e}")

async def test_multiple_notifications(vendor_id, count=3):
    """Send multiple test notifications"""
    
    websocket_url = f"ws://localhost:8000/ws/vendor/{vendor_id}/orders/"
    
    try:
        async with websockets.connect(websocket_url) as websocket:
            print(f"Connected to WebSocket for vendor {vendor_id}")
            
            for i in range(count):
                vendor = Vendor.objects.get(id=vendor_id)
                notification = Notification.objects.create(
                    recipient=vendor.user,
                    title=f"Bulk Test Notification #{i+1}",
                    message=f"This is test notification number {i+1} to test real-time bulk updates.",
                    type=["info", "warning", "success"][i % 3],
                    priority=["low", "medium", "high"][i % 3]
                )
                
                notification_data = {
                    "type": "new_notification",
                    "data": {
                        "id": notification.id,
                        "title": notification.title,
                        "message": notification.message,
                        "type": notification.type,
                        "priority": notification.priority,
                        "is_read": notification.is_read,
                        "created_at": notification.created_at.isoformat(),
                        "vendor_id": vendor_id
                    }
                }
                
                await websocket.send(json.dumps(notification_data))
                print(f"✅ Sent notification #{i+1}: {notification.title}")
                
                # Wait between notifications
                await asyncio.sleep(1)
                
    except Exception as e:
        print(f"❌ Error: {e}")

def list_vendors():
    """List available vendors for testing"""
    vendors = Vendor.objects.select_related('user').all()
    
    if not vendors:
        print("❌ No vendors found. Please create a vendor first.")
        return None
        
    print("\n📋 Available Vendors:")
    print("-" * 50)
    for vendor in vendors:
        print(f"ID: {vendor.id} | Name: {vendor.vendor_name} | User: {vendor.user.username}")
    print("-" * 50)
    
    return vendors

async def main():
    """Main function"""
    print("🔔 WebSocket Notification Tester")
    print("=" * 40)
    
    # List available vendors
    vendors = list_vendors()
    if not vendors:
        return
    
    try:
        vendor_id = input("\n🎯 Enter Vendor ID to test: ").strip()
        vendor_id = int(vendor_id)
        
        # Verify vendor exists
        vendor = Vendor.objects.get(id=vendor_id)
        print(f"\n✅ Testing with vendor: {vendor.vendor_name}")
        
        test_type = input("\n🔧 Choose test type:\n1. Single notification\n2. Notification update\n3. Multiple notifications (3)\n\nEnter choice (1-3): ").strip()
        
        if test_type == "1":
            await send_test_notification(vendor_id)
        elif test_type == "2":
            await send_test_notification(vendor_id)  # This includes an update
        elif test_type == "3":
            await test_multiple_notifications(vendor_id, 3)
        else:
            print("❌ Invalid choice")
            return
            
        print(f"\n🎉 Test completed! Check your vendor dashboard notifications page.")
        print(f"👀 Look for real-time updates and visual indicators.")
        
    except ValueError:
        print("❌ Invalid vendor ID. Please enter a number.")
    except Vendor.DoesNotExist:
        print("❌ Vendor not found.")
    except KeyboardInterrupt:
        print("\n\n👋 Test cancelled by user.")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("🚀 Starting WebSocket notification test...")
    asyncio.run(main())
