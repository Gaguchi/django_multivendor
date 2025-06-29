#!/usr/bin/env python
"""
Quick script to check token blacklist configuration and database state
"""
import os
import sys
import django
import importlib.util

# Add the backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_multivendor.settings')
django.setup()

from django.conf import settings

def check_blacklist_config():
    print("🔍 Checking Token Blacklist Configuration")
    print("=" * 50)
    
    # Check if package is available
    blacklist_available = importlib.util.find_spec('rest_framework_simplejwt.token_blacklist') is not None
    print(f"📦 Token blacklist package available: {blacklist_available}")
    
    # Check settings
    jwt_settings = settings.SIMPLE_JWT
    print(f"🔧 BLACKLIST_AFTER_ROTATION: {jwt_settings.get('BLACKLIST_AFTER_ROTATION', 'Not set')}")
    print(f"🔧 USE_BLACKLIST: {jwt_settings.get('USE_BLACKLIST', 'Not set')}")
    
    # Check if blacklist is in INSTALLED_APPS
    blacklist_in_apps = 'rest_framework_simplejwt.token_blacklist' in settings.INSTALLED_APPS
    print(f"⚙️ Blacklist in INSTALLED_APPS: {blacklist_in_apps}")
    
    if blacklist_available and blacklist_in_apps:
        try:
            from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
            
            # Check database tables
            print(f"📊 Outstanding tokens count: {OutstandingToken.objects.count()}")
            print(f"📊 Blacklisted tokens count: {BlacklistedToken.objects.count()}")
            
            # Test token creation and blacklisting
            from rest_framework_simplejwt.tokens import RefreshToken
            from django.contrib.auth.models import User
            
            # Find a test user
            test_user = User.objects.filter(email__icontains='testvendor').first()
            if test_user:
                print(f"👤 Found test user: {test_user.email}")
                
                # Create a token
                refresh = RefreshToken.for_user(test_user)
                print(f"🎟️ Created refresh token: {str(refresh)[:50]}...")
                
                # Check if it's in outstanding tokens
                outstanding_count_after = OutstandingToken.objects.count()
                print(f"📊 Outstanding tokens after creation: {outstanding_count_after}")
                
                # Try to blacklist it
                try:
                    refresh.blacklist()
                    blacklisted_count_after = BlacklistedToken.objects.count()
                    print(f"📊 Blacklisted tokens after blacklisting: {blacklisted_count_after}")
                    print("✅ Token blacklisting works!")
                except Exception as e:
                    print(f"❌ Error blacklisting token: {e}")
            else:
                print("⚠️ No test user found for token testing")
                
        except Exception as e:
            print(f"❌ Error accessing blacklist models: {e}")
    else:
        print("⚠️ Token blacklist not properly configured")

if __name__ == "__main__":
    check_blacklist_config()
