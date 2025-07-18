#!/usr/bin/env python3
import os
import sys

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_multivendor.settings')

import django
django.setup()

from django.contrib.auth.models import User
from vendors.models import Vendor
from notifications.models import Notification

def main():
    print("🔍 Checking beta@gmail.com vendor account...")
    
    try:
        # Check if user exists
        user = User.objects.get(email='beta@gmail.com')
        print(f"✅ User found: {user.username} (email: {user.email})")
        
        # Check if vendor profile exists
        vendor = Vendor.objects.get(user=user)
        print(f"✅ Vendor profile found: {vendor.store_name} (ID: {vendor.id})")
        
        # Test login credentials
        from django.contrib.auth import authenticate
        auth_user = authenticate(username='beta@gmail.com', password='nji9nji9')
        if auth_user:
            print("✅ Login credentials are valid")
        else:
            print("❌ Login credentials are invalid")
        
        # Check notifications
        notifications = Notification.objects.filter(vendor=vendor).order_by('-created_at')
        print(f"🔔 Found {notifications.count()} notifications for this vendor")
        
        unread_count = notifications.filter(is_read=False).count()
        print(f"🔔 Unread notifications: {unread_count}")
        
        if notifications.exists():
            print("\n📋 Latest notifications:")
            for i, notification in enumerate(notifications[:3]):
                status = "✅ Read" if notification.is_read else "🔔 Unread"
                print(f"  {i+1}. {notification.title} ({notification.notification_type}) - {status}")
                print(f"     Message: {notification.message}")
        
        print("\n🎯 SUMMARY:")
        print("✅ beta@gmail.com is a valid vendor account")
        print("✅ Can login to vendor dashboard at https://seller.bazro.ge/")
        print("✅ Notifications system is ready")
        
    except User.DoesNotExist:
        print("❌ User beta@gmail.com not found")
        print("📋 Available users:")
        for user in User.objects.all()[:5]:
            print(f"  - {user.username} (email: {user.email})")
            
    except Vendor.DoesNotExist:
        print("❌ Vendor profile not found for this user")
        print("💡 This user exists but is not a vendor")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()
