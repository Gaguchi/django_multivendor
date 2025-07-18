#!/usr/bin/env python3
import os
import sys
import django
import requests
import json

# Add the parent directory to Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_multivendor.settings')
django.setup()

def test_api():
    try:
        # Test login
        print('Testing login to https://api.bazro.ge/api/token/')
        response = requests.post('https://api.bazro.ge/api/token/', 
                               json={'username': 'beta@gmail.com', 'password': 'nji9nji9'})
        print('Login Response Status:', response.status_code)
        
        if response.status_code == 200:
            tokens = response.json()
            print('✅ Login successful!')
            print('Access token received')
            
            # Test getting vendor profile
            print('\nTesting vendor profile...')
            headers = {'Authorization': f'Bearer {tokens["access"]}'}
            profile_response = requests.get('https://api.bazro.ge/api/vendors/profile/', headers=headers)
            print('Profile Response Status:', profile_response.status_code)
            
            if profile_response.status_code == 200:
                profile = profile_response.json()
                print('✅ Vendor Profile retrieved successfully!')
                print('Vendor ID:', profile.get('id'))
                print('Store Name:', profile.get('store_name'))
                
                # Test getting notifications
                print('\nTesting notifications...')
                vendor_id = profile['id']
                notification_headers = {
                    'X-Master-Token': 'your-super-secret-token',
                    'X-Vendor-ID': str(vendor_id)
                }
                notifications_response = requests.get('https://api.bazro.ge/api/notifications/vendor-notifications/', 
                                                    headers=notification_headers)
                print('Notifications Response Status:', notifications_response.status_code)
                
                if notifications_response.status_code == 200:
                    notifications = notifications_response.json()
                    print('✅ Notifications retrieved successfully!')
                    print('Total notifications:', len(notifications.get('results', [])))
                    print('Unread count:', notifications.get('unread_count', 0))
                    
                    # Show first few notifications
                    if notifications.get('results'):
                        print('\nFirst few notifications:')
                        for i, notification in enumerate(notifications['results'][:3]):
                            print(f'{i+1}. {notification.get("title")}')
                            print(f'   Message: {notification.get("message")}')
                            print(f'   Type: {notification.get("notification_type")}')
                            print(f'   Read: {notification.get("is_read")}')
                            print(f'   Created: {notification.get("created_at")}')
                            print()
                    else:
                        print('No notifications found')
                        
                    # Test creating a test order to generate notifications
                    print('\nTesting order creation to generate notifications...')
                    from django.contrib.auth.models import User
                    from orders.models import Order, OrderItem
                    from vendors.models import VendorProduct, Vendor
                    from categories.models import Category
                    
                    # Get the vendor
                    vendor = Vendor.objects.get(id=vendor_id)
                    
                    # Create a test order
                    order = Order.objects.create(
                        user=vendor.user,
                        order_number=f'TEST-{vendor_id}-{len(Order.objects.all()) + 1}',
                        status='Pending',
                        total_amount=50.00
                    )
                    
                    # Create or get a product for this vendor
                    category = Category.objects.first()
                    if not category:
                        category = Category.objects.create(name='Test Category')
                    
                    product, created = VendorProduct.objects.get_or_create(
                        vendor=vendor,
                        name='Test Product for Notifications',
                        defaults={
                            'price': 25.00,
                            'stock': 10,
                            'description': 'Test product for notification testing',
                            'category': category
                        }
                    )
                    
                    # Create order item
                    order_item = OrderItem.objects.create(
                        order=order,
                        product=product,
                        quantity=2,
                        unit_price=product.price,
                        total_price=product.price * 2
                    )
                    
                    print(f'✅ Created test order: {order.order_number}')
                    
                    # Update order to paid to trigger more notifications
                    order.status = 'Paid'
                    order.save()
                    
                    print('✅ Updated order to Paid status')
                    
                    # Check notifications again
                    print('\nChecking notifications after order creation...')
                    notifications_response = requests.get('https://api.bazro.ge/api/notifications/vendor-notifications/', 
                                                        headers=notification_headers)
                    if notifications_response.status_code == 200:
                        notifications = notifications_response.json()
                        print('✅ Updated notifications retrieved!')
                        print('Total notifications:', len(notifications.get('results', [])))
                        print('Unread count:', notifications.get('unread_count', 0))
                        
                        # Show latest notifications
                        if notifications.get('results'):
                            print('\nLatest notifications:')
                            for i, notification in enumerate(notifications['results'][:5]):
                                print(f'{i+1}. {notification.get("title")}')
                                print(f'   Message: {notification.get("message")}')
                                print(f'   Type: {notification.get("notification_type")}')
                                print(f'   Read: {notification.get("is_read")}')
                                print()
                    
                else:
                    print('❌ Notifications Error:', notifications_response.text[:200])
                    
            else:
                print('❌ Profile Error:', profile_response.text[:200])
        else:
            print('❌ Login Error:', response.text[:200])
            
    except Exception as e:
        print('❌ Error:', str(e))
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    test_api()
