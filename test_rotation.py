#!/usr/bin/env python
"""
Simple test that focuses on what happens when ROTATE_REFRESH_TOKENS is enabled
"""
import os
import sys
import django
import requests

# Add the backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_multivendor.settings')
django.setup()

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth.models import User
from django.conf import settings

def test_token_rotation_behavior():
    print("🔍 Testing Token Rotation Behavior")
    print("=" * 50)
    
    # Show settings
    print(f"🔧 ROTATE_REFRESH_TOKENS: {settings.SIMPLE_JWT['ROTATE_REFRESH_TOKENS']}")
    print(f"🔧 BLACKLIST_AFTER_ROTATION: {settings.SIMPLE_JWT['BLACKLIST_AFTER_ROTATION']}")
    
    # Get user
    try:
        user = User.objects.get(username='testvendor@bazro.ge')
        print(f"👤 Found user: {user.username}")
    except User.DoesNotExist:
        print("❌ User not found")
        return
    
    # Create a refresh token
    print(f"\n🎟️ Creating refresh token...")
    refresh_token = RefreshToken.for_user(user)
    original_token = str(refresh_token)
    print(f"✅ Created token: {original_token[:50]}...")
    
    # Check initial outstanding count
    initial_outstanding = OutstandingToken.objects.filter(user=user).count()
    initial_blacklisted = BlacklistedToken.objects.filter(token__user=user).count()
    print(f"📊 Initial - Outstanding: {initial_outstanding}, Blacklisted: {initial_blacklisted}")
    
    # Try to use the token to get an access token (simulating refresh)
    print(f"\n🔄 Simulating token refresh...")
    try:
        # Check if token is blacklisted
        refresh_token.check_blacklist()
        print(f"✅ Token is not blacklisted")
        
        # Get access token
        access_token = refresh_token.access_token
        print(f"✅ Generated access token: {str(access_token)[:50]}...")
        
        # Check if this marks the token as used (and potentially blacklisted)
        after_use_outstanding = OutstandingToken.objects.filter(user=user).count()
        after_use_blacklisted = BlacklistedToken.objects.filter(token__user=user).count()
        print(f"📊 After use - Outstanding: {after_use_outstanding}, Blacklisted: {after_use_blacklisted}")
        
        # Check if the specific token is now blacklisted
        outstanding_record = OutstandingToken.objects.filter(user=user, token__endswith=original_token[-20:]).first()
        if outstanding_record:
            is_specific_blacklisted = BlacklistedToken.objects.filter(token=outstanding_record).exists()
            print(f"🎟️ Specific token blacklisted: {is_specific_blacklisted}")
        
    except TokenError as e:
        print(f"❌ Token error: {e}")
    
    # Now test the rotation behavior
    print(f"\n🔄 Testing refresh with rotation...")
    try:
        # Create another fresh token 
        fresh_refresh = RefreshToken.for_user(user)
        fresh_token_str = str(fresh_refresh)
        print(f"🎟️ Fresh token: {fresh_token_str[:50]}...")
        
        # Use the TokenRefreshSerializer logic
        from rest_framework_simplejwt.serializers import TokenRefreshSerializer
        
        # Test serializer
        serializer = TokenRefreshSerializer(data={"refresh": fresh_token_str})
        if serializer.is_valid():
            print(f"✅ Serializer validation passed")
            
            # Get validated data (this should trigger rotation if enabled)
            validated_data = serializer.validated_data
            print(f"📋 New tokens generated:")
            print(f"   🔑 Access: {validated_data['access'][:50]}...")
            if 'refresh' in validated_data:
                print(f"   🔄 Refresh: {validated_data['refresh'][:50]}...")
            else:
                print(f"   🔄 No new refresh token (same one returned)")
            
            # Check blacklist status after rotation
            final_outstanding = OutstandingToken.objects.filter(user=user).count()
            final_blacklisted = BlacklistedToken.objects.filter(token__user=user).count()
            print(f"📊 After rotation - Outstanding: {final_outstanding}, Blacklisted: {final_blacklisted}")
            
        else:
            print(f"❌ Serializer validation failed: {serializer.errors}")
            
    except Exception as e:
        print(f"❌ Rotation test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_token_rotation_behavior()
