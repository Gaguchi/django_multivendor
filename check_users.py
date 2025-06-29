#!/usr/bin/env python
"""
Check what users exist in the database
"""
import os
import sys
import django

# Add the backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_multivendor.settings')
django.setup()

from django.contrib.auth.models import User

def check_users():
    print("👥 Checking users in database...")
    
    users = User.objects.all()
    print(f"📊 Total users: {users.count()}")
    
    for user in users:
        print(f"   👤 Username: {user.username}, Email: {user.email}, ID: {user.id}")
    
    # Try to find our test user by different criteria
    test_email = 'testvendor@bazro.ge'
    
    print(f"\n🔍 Looking for user with email: {test_email}")
    user_by_email = User.objects.filter(email=test_email).first()
    if user_by_email:
        print(f"✅ Found by email: {user_by_email.username}")
    else:
        print(f"❌ Not found by email")
    
    user_by_username = User.objects.filter(username=test_email).first()
    if user_by_username:
        print(f"✅ Found by username: {user_by_username.email}")
    else:
        print(f"❌ Not found by username")

if __name__ == "__main__":
    check_users()
