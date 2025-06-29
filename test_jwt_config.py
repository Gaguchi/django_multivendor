#!/usr/bin/env python
"""
Check if there's a secret key or JWT configuration mismatch
"""
import os
import sys
import django
import requests
import jwt
import json

# Add the backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_multivendor.settings')
django.setup()

from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.settings import api_settings as jwt_settings

def test_jwt_configuration():
    print("🔍 Testing JWT Configuration Consistency")
    print("=" * 60)
    
    # Show current JWT settings
    print("📋 Current JWT Settings:")
    print(f"   🔑 Algorithm: {jwt_settings.ALGORITHM}")
    print(f"   ⏰ Access lifetime: {jwt_settings.ACCESS_TOKEN_LIFETIME}")
    print(f"   ⏰ Refresh lifetime: {jwt_settings.REFRESH_TOKEN_LIFETIME}")
    print(f"   🔄 Rotate tokens: {jwt_settings.ROTATE_REFRESH_TOKENS}")
    print(f"   ⚫ Blacklist after rotation: {jwt_settings.BLACKLIST_AFTER_ROTATION}")
    print(f"   📛 Issuer: {jwt_settings.ISSUER}")
    
    # Get the signing key (first few chars for security)
    signing_key = jwt_settings.SIGNING_KEY
    print(f"   🗝️ Signing key (first 10 chars): {signing_key[:10]}...")
    print(f"   🗝️ Signing key length: {len(signing_key)}")
    
    # Step 1: Get a token from the API
    print(f"\n🌐 Step 1: Getting token from API...")
    test_account = {"username": "testvendor@bazro.ge", "password": "Test123!"}
    
    try:
        login_response = requests.post(
            "https://api.bazro.ge/api/token/", 
            json=test_account, 
            verify=False,
            timeout=10
        )
        
        if login_response.status_code == 200:
            data = login_response.json()
            api_refresh_token = data['refresh']
            print(f"✅ Got token from API")
            
            # Step 2: Try to decode with current settings
            print(f"\n🔍 Step 2: Decoding with current settings...")
            try:
                # Decode without verification first to see the payload
                unverified = jwt.decode(api_refresh_token, options={"verify_signature": False})
                print(f"📄 Unverified payload:")
                print(f"   Token type: {unverified.get('token_type')}")
                print(f"   User ID: {unverified.get('user_id')}")
                print(f"   Issuer: {unverified.get('iss')}")
                print(f"   JTI: {unverified.get('jti')}")
                print(f"   Issued: {unverified.get('iat')}")
                print(f"   Expires: {unverified.get('exp')}")
                
                # Now try with verification
                verified = jwt.decode(
                    api_refresh_token, 
                    signing_key, 
                    algorithms=[jwt_settings.ALGORITHM]
                )
                print(f"✅ Token verified successfully with current key!")
                
            except jwt.ExpiredSignatureError:
                print(f"❌ Token expired")
            except jwt.InvalidSignatureError:
                print(f"❌ Invalid signature - SECRET_KEY mismatch!")
            except jwt.InvalidTokenError as e:
                print(f"❌ Invalid token: {e}")
            
            # Step 3: Try to create a RefreshToken object and use it
            print(f"\n🔧 Step 3: Testing RefreshToken class...")
            try:
                refresh_obj = RefreshToken(api_refresh_token)
                print(f"✅ RefreshToken object created")
                
                # Try to generate access token
                access_token = refresh_obj.access_token
                print(f"✅ Access token generated: {str(access_token)[:50]}...")
                
                # Check if it gets blacklisted when we "use" it
                print(f"🔍 Checking if token gets blacklisted...")
                refresh_obj.check_blacklist()
                print(f"✅ Token is not blacklisted")
                
            except Exception as e:
                print(f"❌ RefreshToken error: {e}")
                
            # Step 4: Test the refresh view directly using Django test client
            print(f"\n🧪 Step 4: Testing with Django test client...")
            try:
                from django.test import Client
                from django.urls import reverse
                
                client = Client()
                response = client.post(
                    '/api/token/refresh/',
                    data=json.dumps({"refresh": api_refresh_token}),
                    content_type='application/json'
                )
                
                print(f"🌐 Django test client response: {response.status_code}")
                if response.status_code == 200:
                    print(f"✅ Refresh successful in Django test client!")
                    response_data = json.loads(response.content)
                    print(f"📊 Response keys: {list(response_data.keys())}")
                else:
                    print(f"❌ Refresh failed in Django test client")
                    print(f"📄 Response: {response.content.decode()}")
                    
            except Exception as e:
                print(f"❌ Django test client error: {e}")
        
        else:
            print(f"❌ API login failed: {login_response.status_code}")
            print(f"📄 Response: {login_response.text}")
            
    except Exception as e:
        print(f"❌ API request failed: {e}")

if __name__ == "__main__":
    test_jwt_configuration()
