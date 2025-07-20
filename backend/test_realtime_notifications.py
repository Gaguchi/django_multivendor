#!/usr/bin/env python
"""
Test script for real-time WebSocket notifications
"""
import os
import sys
import django

# Setup Django
sys.path.insert(0, '/e/Work/WebDev/django_multivendor/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_multivendor.settings')
django.setup()

from django.contrib.auth.models import User
from vendors.models import Vendor
from orders.models import Order, OrderItem
from notifications.services import NotificationService
from notifications.models import Notification
import uuid
from django.utils import timezone

def test_realtime_notifications():
    """Test creating notifications that should trigger WebSocket updates"""
    print("🧪 Testing Real-Time WebSocket Notifications")
    print("=" * 50)
    
    try:
        # Find the test vendor (beta@gmail.com)
        vendor_user = User.objects.get(email='beta@gmail.com')
        vendor = Vendor.objects.get(user=vendor_user)
        
        print(f"✅ Found test vendor: {vendor.store_name} (ID: {vendor.id})")
        print(f"   User: {vendor_user.username} ({vendor_user.email})")
        
        # Create a test notification manually
        print("\n1. Creating a test notification...")
        notification = NotificationService.create_notification(
            recipient=vendor_user,
            vendor=vendor,
            notification_type='system_announcement',
            title='🎉 WebSocket Test Notification',
            message='This notification was created to test real-time WebSocket updates. If you see this immediately in your vendor dashboard, the integration is working!',
            priority='high',
            data={
                'test': True,
                'timestamp': timezone.now().isoformat(),
                'feature': 'realtime_websocket_notifications'
            }
        )
        
        if notification:
            print(f"✅ Created notification: {notification.title}")
            print(f"   ID: {notification.id}")
            print(f"   Priority: {notification.priority}")
            print(f"   Type: {notification.notification_type}")
            
            # The WebSocket notification should have been sent automatically
            # via the signal in notifications/signals.py -> NotificationService.create_notification -> websocket.py
            
            print(f"\n🌐 WebSocket Channel: vendor_orders_{vendor.id}")
            print(f"📡 Real-time notification should appear in vendor dashboard immediately!")
            
        else:
            print("❌ Failed to create notification")
            return False
            
        # Create a second notification after 2 seconds to test multiple updates
        import time
        print("\n2. Creating a second notification in 3 seconds...")
        time.sleep(3)
        
        notification2 = NotificationService.create_notification(
            recipient=vendor_user,
            vendor=vendor,
            notification_type='order_created',
            title='📦 Test Order Notification',
            message='This is a second test notification to verify multiple real-time updates work correctly.',
            priority='medium',
            data={
                'test': True,
                'test_number': 2,
                'order_number': f'TEST-{uuid.uuid4().hex[:8].upper()}'
            }
        )
        
        if notification2:
            print(f"✅ Created second notification: {notification2.title}")
            print(f"   ID: {notification2.id}")
        
        # Test marking a notification as read (should trigger update via WebSocket)
        print("\n3. Testing notification update via WebSocket...")
        time.sleep(2)
        
        # Mark the first notification as read
        notification.mark_as_read()
        print(f"✅ Marked notification {notification.id} as read")
        print("   This should trigger a WebSocket update to refresh the notification status")
        
        print("\n" + "=" * 50)
        print("✅ Real-Time Notification Test Complete!")
        print("\n🎯 What to check in your vendor dashboard:")
        print(f"   1. Login to: https://seller.bazro.ge/")
        print(f"   2. Use credentials: {vendor_user.email} / nji9nji9")
        print(f"   3. Watch the notification bell - should show new notifications immediately")
        print(f"   4. Check browser console for WebSocket messages")
        print(f"   5. Notification dropdown should show the test notifications")
        print(f"   6. Toast notifications should appear for real-time updates")
        
        print(f"\n🔍 Recent notifications for {vendor.store_name}:")
        recent_notifications = Notification.objects.filter(
            vendor=vendor,
            created_at__gte=timezone.now() - timezone.timedelta(minutes=5)
        ).order_by('-created_at')[:5]
        
        for notif in recent_notifications:
            status = "📖 Read" if notif.is_read else "🔔 Unread"
            print(f"   • [{notif.id}] {notif.title} - {status}")
            
        return True
        
    except User.DoesNotExist:
        print("❌ Test vendor beta@gmail.com not found")
        print("   Please run the notification setup script first")
        return False
    except Vendor.DoesNotExist:
        print("❌ Vendor for beta@gmail.com not found")
        return False
    except Exception as e:
        print(f"❌ Error during test: {e}")
        return False

if __name__ == "__main__":
    success = test_realtime_notifications()
    
    if success:
        print(f"\n🎉 Test completed successfully!")
        print(f"💡 Open the vendor dashboard and watch for real-time updates!")
    else:
        print(f"\n❌ Test failed. Check the error messages above.")
