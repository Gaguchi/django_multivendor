#!/usr/bin/env python
"""
Debug script to test the order and notification methods
"""
import os
import sys
import django
from django.conf import settings

# Add the backend directory to the path and set up Django
sys.path.append('e:/Work/WebDev/django_multivendor/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_multivendor.settings')
django.setup()

from orders.models import Order, OrderItem
from vendors.models import Vendor, VendorProduct
from notifications.services import NotificationService

def debug_order_methods():
    # Get the last order
    order = Order.objects.last()
    if not order:
        print("No orders found")
        return
    
    print(f"Order: {order.order_number}")
    print(f"Status: {order.status}")
    print(f"Total: ${order.total_amount}")
    
    # Check order items
    items = order.items.all()
    print(f"Items: {items.count()}")
    for item in items:
        print(f"  - {item.quantity} x {item.product.name} (${item.total_price})")
        print(f"    Vendor: {item.product.vendor.store_name}")
    
    # Check vendors
    vendors = order.get_vendors()
    print(f"Vendors: {vendors.count()}")
    for vendor in vendors:
        print(f"  - {vendor.store_name}")
        vendor_items = order.get_vendor_items(vendor)
        vendor_total = order.get_vendor_total(vendor)
        print(f"    Items: {vendor_items.count()}")
        print(f"    Total: ${vendor_total}")
        
        # Test notification creation
        print(f"    Testing notification creation for {vendor.store_name}...")
        notification = NotificationService.create_notification(
            recipient=vendor.user,
            vendor=vendor,
            notification_type='order_created',
            title=f"Test Order #{order.order_number}",
            message=f"Test notification for order {order.order_number}",
            priority='high',
            related_order=order
        )
        
        if notification:
            print(f"    ✓ Notification created: {notification.id}")
        else:
            print(f"    ✗ Failed to create notification")

if __name__ == '__main__':
    debug_order_methods()
