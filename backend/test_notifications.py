#!/usr/bin/env python
"""
Test script to create a test order and verify notifications are working
"""
import os
import sys
import django
from django.conf import settings

# Add the backend directory to the path and set up Django
sys.path.append('e:/Work/WebDev/django_multivendor/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_multivendor.settings')
django.setup()

from django.contrib.auth.models import User
from vendors.models import Vendor, VendorProduct
from orders.models import Order, OrderItem
from notifications.models import Notification
from notifications.services import NotificationService
from categories.models import Category
from django.utils import timezone
import uuid

def create_test_order():
    print("Creating test order to verify notifications...")
    
    try:
        # Create a test user (customer)
        customer, created = User.objects.get_or_create(
            username='testcustomer',
            defaults={
                'email': 'customer@test.com',
                'first_name': 'Test',
                'last_name': 'Customer'
            }
        )
        print(f"Customer: {customer.username} {'(created)' if created else '(exists)'}")
        
        # Create a test vendor user
        vendor_user, created = User.objects.get_or_create(
            username='testvendor',
            defaults={
                'email': 'vendor@test.com',
                'first_name': 'Test',
                'last_name': 'Vendor'
            }
        )
        print(f"Vendor user: {vendor_user.username} {'(created)' if created else '(exists)'}")
        
        # Create a test vendor
        vendor, created = Vendor.objects.get_or_create(
            user=vendor_user,
            defaults={
                'store_name': 'Test Store',
                'description': 'A test store for notifications',
                'contact_email': 'vendor@test.com',
                'phone': '1234567890',
                'address': '123 Test Street'
            }
        )
        print(f"Vendor: {vendor.store_name} {'(created)' if created else '(exists)'}")
        
        # Create a test category
        category, created = Category.objects.get_or_create(
            name='Test Category',
            defaults={
                'slug': 'test-category',
                'created_at': timezone.now(),
                'updated_at': timezone.now()
            }
        )
        print(f"Category: {category.name} {'(created)' if created else '(exists)'}")
        
        # Create a test product
        product, created = VendorProduct.objects.get_or_create(
            vendor=vendor,
            name='Test Product',
            defaults={
                'description': 'A test product for notifications',
                'price': 99.99,
                'stock': 10,
                'category': category
            }
        )
        print(f"Product: {product.name} {'(created)' if created else '(exists)'}")
        
        # Create a test order
        order_number = str(uuid.uuid4().hex)[:10]
        order = Order.objects.create(
            user=customer,
            order_number=order_number,
            status='Pending',
            total_amount=199.98,
            payment_method='Credit Card',
            shipping_address='123 Customer Street',
            billing_address='123 Customer Street',
            created_at=timezone.now(),
            updated_at=timezone.now()
        )
        print(f"Order created: {order.order_number}")
        
        # Create order items
        order_item = OrderItem.objects.create(
            order=order,
            product=product,
            quantity=2,
            unit_price=product.price,
            total_price=product.price * 2
        )
        print(f"Order item created: {order_item.quantity} x {order_item.product.name}")
        
        # The signal should automatically create notifications
        print("\nWaiting for signal to create notifications...")
        
        # Check if notifications were created
        notifications = Notification.objects.filter(
            vendor=vendor,
            related_order=order
        )
        
        print(f"\nNotifications created: {notifications.count()}")
        for notification in notifications:
            print(f"- {notification.title}: {notification.message}")
        
        # Update order status to trigger more notifications
        print("\nUpdating order status to 'Paid'...")
        order.status = 'Paid'
        order.save()
        
        # Check for new notifications
        notifications = Notification.objects.filter(
            vendor=vendor,
            related_order=order
        )
        
        print(f"\nTotal notifications after payment: {notifications.count()}")
        for notification in notifications:
            print(f"- {notification.title}: {notification.message}")
        
        print(f"\nTest completed successfully!")
        print(f"Order ID: {order.id}")
        print(f"Order Number: {order.order_number}")
        print(f"Vendor ID: {vendor.id}")
        print(f"Vendor Name: {vendor.store_name}")
        
        return order, vendor
        
    except Exception as e:
        print(f"Error creating test order: {e}")
        import traceback
        traceback.print_exc()
        return None, None

def test_notification_api():
    print("\n=== Testing Notification API ===")
    
    try:
        # Test creating a notification directly
        vendor = Vendor.objects.first()
        if not vendor:
            print("No vendor found. Run create_test_order first.")
            return
        
        notification = NotificationService.create_notification(
            recipient=vendor.user,
            vendor=vendor,
            notification_type='system_announcement',
            title='Test Notification',
            message='This is a test notification created via API',
            priority='high'
        )
        
        if notification:
            print(f"Test notification created: {notification.id}")
            print(f"Title: {notification.title}")
            print(f"Message: {notification.message}")
            print(f"Priority: {notification.priority}")
        else:
            print("Failed to create test notification")
            
    except Exception as e:
        print(f"Error testing notification API: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    # Create test order
    order, vendor = create_test_order()
    
    if order and vendor:
        # Test notification API
        test_notification_api()
        
        print("\n=== Test Summary ===")
        print(f"✓ Order created: {order.order_number}")
        print(f"✓ Vendor: {vendor.store_name}")
        print(f"✓ Notifications should be visible in the vendor dashboard")
        print(f"✓ You can now test the frontend notification system")
        print(f"\nVendor Dashboard URL: http://localhost:5174/")
        print(f"Use vendor credentials: vendor@test.com / password")
    else:
        print("Test failed - check the error messages above")
