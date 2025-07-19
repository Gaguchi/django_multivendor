#!/usr/bin/env python3
"""
Test script to create sample notifications for the vendor dashboard
This script demonstrates the notification system functionality
"""

import requests
import json
import sys
from datetime import datetime

# Configuration
API_BASE_URL = "https://api.bazro.ge"
VENDOR_EMAIL = "beta@gmail.com"
VENDOR_PASSWORD = "nji9nji9"

def login_vendor():
    """Login and get vendor authentication token"""
    login_url = f"{API_BASE_URL}/api/users/login/"
    login_data = {
        "email": VENDOR_EMAIL,
        "password": VENDOR_PASSWORD
    }
    
    try:
        response = requests.post(login_url, json=login_data)
        response.raise_for_status()
        data = response.json()
        
        if data.get('access'):
            print(f"✅ Vendor login successful")
            return data['access']
        else:
            print(f"❌ Login failed: {data}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Login error: {e}")
        return None

def get_vendor_profile(token):
    """Get vendor profile information"""
    profile_url = f"{API_BASE_URL}/api/vendors/profile/"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(profile_url, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        print(f"✅ Vendor profile retrieved: {data.get('shop_name', 'Unknown Shop')}")
        return data
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Profile error: {e}")
        return None

def get_notifications(token):
    """Fetch current notifications"""
    notifications_url = f"{API_BASE_URL}/api/notifications/vendor/"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(notifications_url, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        notifications = data.get('results', []) if isinstance(data, dict) else data
        print(f"✅ Found {len(notifications)} notifications")
        
        for notification in notifications[:5]:  # Show first 5
            status = "🔔 NEW" if not notification.get('is_read') else "✅ READ"
            print(f"   {status} - {notification.get('title')} ({notification.get('type')})")
            
        return notifications
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Notifications fetch error: {e}")
        return []

def create_test_notification(token, vendor_id):
    """Create a test notification"""
    notification_url = f"{API_BASE_URL}/api/notifications/create-test/"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    test_notification = {
        "vendor_id": vendor_id,
        "title": "Test Notification",
        "message": "This is a test notification created from the demo script",
        "type": "order_placed"
    }
    
    try:
        response = requests.post(notification_url, json=test_notification, headers=headers)
        if response.status_code in [200, 201]:
            print(f"✅ Test notification created successfully")
            return True
        else:
            print(f"❌ Test notification failed: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Test notification error: {e}")
        return False

def main():
    print("🚀 Vendor Dashboard Notifications Demo")
    print("=" * 50)
    
    # Step 1: Login
    print("\n1. Logging in vendor...")
    token = login_vendor()
    if not token:
        sys.exit(1)
    
    # Step 2: Get vendor profile
    print("\n2. Getting vendor profile...")
    vendor_profile = get_vendor_profile(token)
    if not vendor_profile:
        sys.exit(1)
    
    vendor_id = vendor_profile.get('id')
    if not vendor_id:
        print("❌ Could not get vendor ID")
        sys.exit(1)
    
    # Step 3: Check current notifications
    print("\n3. Checking current notifications...")
    notifications = get_notifications(token)
    
    # Step 4: Create test notification (if API supports it)
    print("\n4. Creating test notification...")
    create_test_notification(token, vendor_id)
    
    # Step 5: Check notifications again
    print("\n5. Checking notifications after test...")
    get_notifications(token)
    
    print("\n" + "=" * 50)
    print("✅ Demo completed!")
    print(f"🌐 Visit the notifications page: http://localhost:5176/notifications")
    print(f"🔔 Login with: {VENDOR_EMAIL} / {VENDOR_PASSWORD}")

if __name__ == "__main__":
    main()
