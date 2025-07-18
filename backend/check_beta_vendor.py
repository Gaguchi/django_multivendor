#!/usr/bin/env python3
import os
import sys
import django

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_multivendor.settings')
django.setup()

from vendors.models import Vendor
from django.contrib.auth.models import User
from notifications.models import Notification

def check_beta_vendor():
    print('=== Checking for Beta Vendor ===')
    
    # Check all vendors
    vendors = Vendor.objects.all()
    print(f'Total vendors: {vendors.count()}')
    
    beta_vendor = None
    
    for vendor in vendors:
        print(f'Vendor: {vendor.store_name} - User: {vendor.user.username} - Email: {vendor.user.email}')
        
        if 'beta' in vendor.user.email.lower() or 'beta' in vendor.user.username.lower():
            beta_vendor = vendor
            print(f'✅ Found beta vendor! ID: {vendor.id}')
            break
    
    if beta_vendor:
        # Check notifications for this vendor
        notifications = Notification.objects.filter(vendor=beta_vendor)
        print(f'Notifications for {beta_vendor.store_name}: {notifications.count()}')
        
        for notification in notifications.order_by('-created_at')[:5]:
            print(f'  - {notification.title} ({notification.notification_type}) - Read: {notification.is_read}')
        
        unread_count = notifications.filter(is_read=False).count()
        print(f'Unread notifications: {unread_count}')
        
        return beta_vendor
    else:
        print('❌ Beta vendor not found')
        return None

if __name__ == '__main__':
    check_beta_vendor()
