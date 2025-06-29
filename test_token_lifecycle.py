#!/usr/bin/env python
"""
Debug script to test token refresh with detailed blacklist tracking
"""
import os
import sys
import django
import requests
import json

# Add the backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_multivendor.settings')
django.setup()

from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User

BASE_URL = "https://api.bazro.ge"

def test_token_lifecycle():
    print("🔍 Testing Token Lifecycle with Blacklist Tracking")
    print("=" * 60)
    
    # Test account credentials
    test_account = {
        "username": "testvendor@bazro.ge",
        "password": "Test123!"
    }
    
    print(f"📝 Testing with account: {test_account['username']}")
    
    # Track initial counts
    initial_outstanding = OutstandingToken.objects.count()
    initial_blacklisted = BlacklistedToken.objects.count()
    print(f"📊 Initial - Outstanding: {initial_outstanding}, Blacklisted: {initial_blacklisted}")
    
    # Step 1: Login
    login_url = f"{BASE_URL}/api/token/"
    try:
        login_response = requests.post(login_url, json=test_account, timeout=10)
        
        if login_response.status_code == 200:
            login_data = login_response.json()
            access_token = login_data['access']
            refresh_token = login_data['refresh']
            
            print(f"✅ Login successful!")
            print(f"🎟️ Access token (first 50 chars): {access_token[:50]}...")
            print(f"🔄 Refresh token (first 50 chars): {refresh_token[:50]}...")
            
            # Check counts after login
            outstanding_after_login = OutstandingToken.objects.count()
            blacklisted_after_login = BlacklistedToken.objects.count()
            print(f"📊 After login - Outstanding: {outstanding_after_login}, Blacklisted: {blacklisted_after_login}")
            
            # Find the user and check their tokens
            try:
                user = User.objects.get(email=test_account['username'])
                user_outstanding = OutstandingToken.objects.filter(user=user)
                print(f"👤 User {user.email} has {user_outstanding.count()} outstanding tokens")
                
                # Show the most recent token
                if user_outstanding.exists():
                    latest_token = user_outstanding.order_by('-created_at').first()
                    print(f"🕒 Latest token created: {latest_token.created_at}")
                    print(f"🎟️ Latest token (first 50): {latest_token.token[:50]}...")
                    
                    # Check if this token is blacklisted
                    is_blacklisted = BlacklistedToken.objects.filter(token__token=latest_token.token).exists()
                    print(f"⚫ Latest token blacklisted: {is_blacklisted}")
                    
            except User.DoesNotExist:
                print("⚠️ User not found in database")
            
            # Step 2: Wait a moment and try refresh
            print("\n🔄 Attempting token refresh...")
            refresh_url = f"{BASE_URL}/api/token/refresh/"
            refresh_payload = {"refresh": refresh_token}
            
            refresh_response = requests.post(refresh_url, json=refresh_payload, timeout=10)
            
            print(f"📡 Refresh status: {refresh_response.status_code}")
            
            if refresh_response.status_code == 200:
                refresh_data = refresh_response.json()
                new_access = refresh_data.get('access')
                new_refresh = refresh_data.get('refresh')  # This might be present if rotation is enabled
                
                print("✅ Refresh successful!")
                print(f"🎟️ New access token (first 50): {new_access[:50]}...")
                if new_refresh:
                    print(f"🔄 New refresh token (first 50): {new_refresh[:50]}...")
                else:
                    print("🔄 No new refresh token (rotation disabled or same token)")
                
                # Check counts after refresh
                outstanding_after_refresh = OutstandingToken.objects.count()
                blacklisted_after_refresh = BlacklistedToken.objects.count()
                print(f"📊 After refresh - Outstanding: {outstanding_after_refresh}, Blacklisted: {blacklisted_after_refresh}")
                
            else:
                print(f"❌ Refresh failed!")
                try:
                    error_data = refresh_response.json()
                    print(f"Error response: {json.dumps(error_data, indent=2)}")
                except:
                    print(f"Error text: {refresh_response.text}")
                
                # Check if the token got blacklisted during the attempt
                try:
                    user = User.objects.get(email=test_account['username'])
                    user_outstanding = OutstandingToken.objects.filter(user=user)
                    
                    # Look for the refresh token in outstanding tokens
                    matching_outstanding = None
                    for token_record in user_outstanding:
                        if refresh_token.endswith(token_record.token[-20:]):  # Match last 20 chars
                            matching_outstanding = token_record
                            break
                    
                    if matching_outstanding:
                        is_blacklisted = BlacklistedToken.objects.filter(token=matching_outstanding).exists()
                        print(f"🔍 Original refresh token blacklisted: {is_blacklisted}")
                        
                        if is_blacklisted:
                            blacklist_entry = BlacklistedToken.objects.filter(token=matching_outstanding).first()
                            print(f"⚫ Blacklisted at: {blacklist_entry.blacklisted_at}")
                    else:
                        print("🔍 Could not find matching outstanding token")
                        
                except Exception as e:
                    print(f"⚠️ Error checking blacklist status: {e}")
        else:
            print(f"❌ Login failed with status {login_response.status_code}")
            print(f"Response: {login_response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error: {e}")

if __name__ == "__main__":
    test_token_lifecycle()
