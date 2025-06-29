#!/usr/bin/env python
"""
Diagnose token refresh issues by examining the actual token processing
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

from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.contrib.auth.models import User
import json

BASE_URL = "https://api.bazro.ge"

def diagnose_refresh_token_issue():
    print("🔍 Diagnosing Token Refresh Issue")
    print("=" * 50)
    
    # Step 1: Get a fresh token from the API
    test_account = {"username": "testvendor@bazro.ge", "password": "Test123!"}
    
    login_response = requests.post(f"{BASE_URL}/api/token/", json=test_account, verify=False)
    
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.text}")
        return
    
    data = login_response.json()
    api_refresh_token = data['refresh']
    api_access_token = data['access']
    
    print(f"✅ Got fresh tokens from API")
    print(f"🎟️ Refresh token: {api_refresh_token[:50]}...")
    
    # Step 2: Try to validate this token using Django's token system
    try:
        print("\n🔍 Step 2: Validating token with Django...")
        refresh_token_obj = RefreshToken(api_refresh_token)
        print(f"✅ Token object created successfully")
        print(f"📊 Token payload: {refresh_token_obj.payload}")
        
        # Check if it's blacklisted
        try:
            refresh_token_obj.check_blacklist()
            print("✅ Token is not blacklisted")
        except TokenError as e:
            print(f"❌ Token is blacklisted: {e}")
            return
            
        # Try to get a new access token
        try:
            new_access_token = refresh_token_obj.access_token
            print(f"✅ Generated new access token: {str(new_access_token)[:50]}...")
        except Exception as e:
            print(f"❌ Failed to generate access token: {e}")
            
    except (TokenError, InvalidToken) as e:
        print(f"❌ Token validation failed: {e}")
        print(f"📝 Error type: {type(e)}")
        
        # Let's try to understand why
        try:
            # Try to decode manually
            import jwt
            from django.conf import settings
            
            decoded = jwt.decode(api_refresh_token, settings.SECRET_KEY, algorithms=['HS256'])
            print(f"✅ Manual JWT decode successful: {decoded}")
            
        except jwt.ExpiredSignatureError:
            print("❌ Token is expired")
        except jwt.InvalidTokenError as jwt_error:
            print(f"❌ JWT decode failed: {jwt_error}")
        except Exception as decode_error:
            print(f"❌ Unknown decode error: {decode_error}")
    
    # Step 3: Check the blacklist database
    print(f"\n🔍 Step 3: Checking blacklist database...")
    try:
        # Look for this specific token
        outstanding_tokens = OutstandingToken.objects.filter(token__endswith=api_refresh_token[-20:])
        print(f"📊 Found {outstanding_tokens.count()} outstanding tokens ending with {api_refresh_token[-20:]}")
        
        for token_record in outstanding_tokens:
            is_blacklisted = BlacklistedToken.objects.filter(token=token_record).exists()
            print(f"🎟️ Token {token_record.token[-20:]}... - Blacklisted: {is_blacklisted}")
            print(f"   Created: {token_record.created_at}")
            if token_record.user:
                print(f"   User: {token_record.user.username} ({token_record.user.email})")
                
    except Exception as e:
        print(f"❌ Database check failed: {e}")
    
    # Step 4: Try the refresh endpoint manually with detailed logging
    print(f"\n🔍 Step 4: Testing refresh endpoint...")
    refresh_response = requests.post(
        f"{BASE_URL}/api/token/refresh/", 
        json={"refresh": api_refresh_token},
        verify=False
    )
    
    print(f"📡 Refresh response status: {refresh_response.status_code}")
    print(f"📄 Response: {refresh_response.text}")

if __name__ == "__main__":
    diagnose_refresh_token_issue()
