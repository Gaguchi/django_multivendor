#!/usr/bin/env python
"""
Test script for WebSocket notification integration
"""
import os
import sys
import django

# Setup Django
sys.path.insert(0, 'e:/Work/WebDev/django_multivendor/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_multivendor.settings')
django.setup()

from orders.models import Order
from vendors.models import Vendor
from notifications.services import NotificationService
from django.utils import timezone

def test_notification_websocket():
    """Test sending WebSocket notifications"""
    try:
        # Get a vendor to test with
        vendor = Vendor.objects.first()
        if not vendor:
            print("❌ No vendor found in database")
            print("Please create some test data first")
            return False
            
        print(f"📡 Testing WebSocket notification for vendor {vendor.id} ({vendor.store_name})")
        
        # Create a test notification directly
        notification = NotificationService.create_notification(
            recipient=vendor.user,
            vendor=vendor,
            notification_type='order_created',
            title='🧪 Test WebSocket Notification',
            message='This is a test notification sent via WebSocket to verify real-time functionality.',
            priority='high',
            data={
                'test': True,
                'timestamp': str(timezone.now())
            }
        )
        
        if notification:
            print(f"✅ WebSocket notification created successfully!")
            print(f"   - Notification ID: {notification.id}")
            print(f"   - Title: {notification.title}")
            print(f"   - Vendor: {vendor.store_name}")
            print(f"   - WebSocket sent to: vendor_orders_{vendor.id}")
            print()
            print("🌐 Check your vendor dashboard for the real-time notification!")
            print(f"   - Login with vendor credentials")
            print(f"   - Look for the notification bell animation")
            print(f"   - Check for toast notification popup")
            return True
        else:
            print("❌ Failed to create notification")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_order_notification():
    """Test creating an order and ensuring notifications are sent"""
    try:
        from django.contrib.auth.models import User
        from orders.models import OrderItem
        from vendors.models import VendorProduct
        import uuid
        
        # Get test data
        vendor = Vendor.objects.first()
        vendor_product = VendorProduct.objects.filter(vendor=vendor).first()
        customer = User.objects.exclude(id=vendor.user.id).first()
        
        if not all([vendor, vendor_product, customer]):
            print("❌ Missing test data (vendor, product, or customer)")
            return False
            
        print(f"📦 Creating test order for vendor {vendor.store_name}")
        
        # Create a test order
        order_number = f"TEST-{str(uuid.uuid4().hex)[:8]}"
        order = Order.objects.create(
            user=customer,
            order_number=order_number,
            status='Pending',
            total_amount=vendor_product.price,
            payment_method='Test',
            shipping_address='123 Test Street',
            billing_address='123 Test Street',
            created_at=timezone.now(),
            updated_at=timezone.now()
        )
        
        # Create order items
        order_item = OrderItem.objects.create(
            order=order,
            product=vendor_product,
            quantity=1,
            unit_price=vendor_product.price,
            total_price=vendor_product.price
        )
        
        print(f"✅ Test order created: {order.order_number}")
        print(f"   - Product: {vendor_product.name}")
        print(f"   - Vendor: {vendor.store_name}")
        print(f"   - This should trigger WebSocket notifications!")
        print()
        print("🌐 Check your vendor dashboard for:")
        print(f"   - Real-time order notification")
        print(f"   - Toast popup for new order")
        print(f"   - Updated notification count")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creating test order: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing WebSocket Notification Integration")
    print("=" * 50)
    
    # Test 1: Direct notification WebSocket
    print("\n1. Testing direct WebSocket notification...")
    direct_success = test_notification_websocket()
    
    # Test 2: Order-triggered notification
    print("\n2. Testing order-triggered WebSocket notification...")
    order_success = test_order_notification()
    
    print("\n" + "=" * 50)
    if direct_success and order_success:
        print("✅ All WebSocket notification tests completed!")
        print()
        print("🎯 Next steps:")
        print("   1. Open vendor dashboard in browser")
        print("   2. Login with vendor credentials")
        print("   3. Watch for real-time notifications")
        print("   4. Check notification bell for animations")
        print("   5. Look for toast popup messages")
    else:
        print("❌ Some tests failed. Check the error messages above.")
        
    print(f"\n🌐 Visit the vendor dashboard: http://localhost:5176/")
    print(f"🔔 Check WebSocket connection status indicator")
