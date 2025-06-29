#!/usr/bin/env python3
"""
Comprehensive JWT Token Refresh Test Suite

This script consolidates all JWT token refresh testing into one comprehensive suite.
Tests login, token refresh, error handling, and various edge cases.
"""

import os
import sys
import django
import requests
import json
import jwt
import base64
from datetime import datetime
import urllib3

# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Add the backend directory to Python path
backend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'backend')
sys.path.insert(0, backend_path)

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_multivendor.settings')
django.setup()

from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from django.contrib.auth.models import User

API_BASE_URL = "https://api.bazro.ge"

class JWTTestSuite:
    def __init__(self):
        self.session = requests.Session()
        self.test_accounts = [
            {"username": "testvendor@bazro.ge", "password": "Test123!"},
            {"username": "vendor@example.com", "password": "vendorpass123"},
            {"username": "admin2", "password": "admin2password"}
        ]
        
    def decode_jwt_payload(self, token):
        """Decode JWT payload without verification"""
        try:
            parts = token.split('.')
            if len(parts) != 3:
                return None
            
            payload = parts[1]
            payload += '=' * (4 - len(payload) % 4)
            decoded = base64.urlsafe_b64decode(payload)
            return json.loads(decoded)
        except Exception as e:
            print(f"Error decoding token: {e}")
            return None

    def test_login_and_token_structure(self):
        """Test 1: Basic login and token structure validation"""
        print("🧪 Test 1: Login and Token Structure")
        print("-" * 40)
        
        for account in self.test_accounts:
            try:
                response = self.session.post(
                    f"{API_BASE_URL}/api/token/",
                    json=account,
                    verify=False,
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    print(f"✅ Login successful for {account['username']}")
                    
                    # Validate token structure
                    access_token = data.get('access')
                    refresh_token = data.get('refresh')
                    
                    if access_token and refresh_token:
                        access_payload = self.decode_jwt_payload(access_token)
                        refresh_payload = self.decode_jwt_payload(refresh_token)
                        
                        print(f"   📊 Access token expires: {datetime.fromtimestamp(access_payload.get('exp', 0))}")
                        print(f"   📊 Refresh token expires: {datetime.fromtimestamp(refresh_payload.get('exp', 0))}")
                        return access_token, refresh_token, account['username']
                    else:
                        print(f"❌ Missing tokens in response for {account['username']}")
                else:
                    print(f"❌ Login failed for {account['username']}: {response.status_code}")
                    
            except Exception as e:
                print(f"❌ Exception for {account['username']}: {e}")
        
        return None, None, None

    def test_immediate_refresh(self, refresh_token):
        """Test 2: Immediate token refresh after login"""
        print("\n🧪 Test 2: Immediate Token Refresh")
        print("-" * 40)
        
        try:
            response = self.session.post(
                f"{API_BASE_URL}/api/token/refresh/",
                json={"refresh": refresh_token},
                verify=False,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                print("✅ Immediate refresh successful")
                print(f"   📊 Response keys: {list(data.keys())}")
                
                # Check for token rotation
                if 'refresh' in data and data['refresh'] != refresh_token:
                    print("   🔄 Token rotation detected (new refresh token provided)")
                    return data.get('access'), data.get('refresh')
                else:
                    print("   🔄 Same refresh token returned (no rotation)")
                    return data.get('access'), refresh_token
            else:
                print(f"❌ Immediate refresh failed: {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error text: {response.text}")
                return None, None
                
        except Exception as e:
            print(f"❌ Exception during refresh: {e}")
            return None, None

    def test_django_level_validation(self, refresh_token, username):
        """Test 3: Django-level token validation"""
        print("\n🧪 Test 3: Django-Level Token Validation")
        print("-" * 40)
        
        try:
            # Test with Django's token system
            refresh_obj = RefreshToken(refresh_token)
            print("✅ RefreshToken object created successfully")
            
            # Generate access token
            access_token = refresh_obj.access_token
            print("✅ Access token generated from refresh token")
            
            # Check blacklist status
            refresh_obj.check_blacklist()
            print("✅ Token is not blacklisted")
            
            # Check database records
            user = User.objects.filter(username=username).first()
            if user:
                outstanding_count = OutstandingToken.objects.filter(user=user).count()
                blacklisted_count = BlacklistedToken.objects.filter(token__user=user).count()
                print(f"📊 User outstanding tokens: {outstanding_count}")
                print(f"📊 User blacklisted tokens: {blacklisted_count}")
            
            return True
            
        except Exception as e:
            print(f"❌ Django validation failed: {e}")
            return False

    def test_jwt_configuration(self):
        """Test 4: JWT Configuration Validation"""
        print("\n🧪 Test 4: JWT Configuration")
        print("-" * 40)
        
        jwt_settings = settings.SIMPLE_JWT
        print(f"🔧 ROTATE_REFRESH_TOKENS: {jwt_settings.get('ROTATE_REFRESH_TOKENS')}")
        print(f"🔧 BLACKLIST_AFTER_ROTATION: {jwt_settings.get('BLACKLIST_AFTER_ROTATION')}")
        print(f"🔧 ACCESS_TOKEN_LIFETIME: {jwt_settings.get('ACCESS_TOKEN_LIFETIME')}")
        print(f"🔧 REFRESH_TOKEN_LIFETIME: {jwt_settings.get('REFRESH_TOKEN_LIFETIME')}")
        print(f"🔧 Algorithm: {jwt_settings.get('ALGORITHM')}")
        print(f"🔧 Issuer: {jwt_settings.get('ISSUER')}")

    def test_multiple_refreshes(self, initial_refresh_token):
        """Test 5: Multiple consecutive refreshes"""
        print("\n🧪 Test 5: Multiple Consecutive Refreshes")
        print("-" * 40)
        
        current_refresh = initial_refresh_token
        
        for i in range(3):
            try:
                response = self.session.post(
                    f"{API_BASE_URL}/api/token/refresh/",
                    json={"refresh": current_refresh},
                    verify=False,
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    print(f"✅ Refresh {i+1} successful")
                    current_refresh = data.get('refresh', current_refresh)
                else:
                    print(f"❌ Refresh {i+1} failed: {response.status_code}")
                    break
                    
            except Exception as e:
                print(f"❌ Refresh {i+1} exception: {e}")
                break

    def run_all_tests(self):
        """Run the complete test suite"""
        print("🔍 JWT Token Refresh - Comprehensive Test Suite")
        print("=" * 60)
        
        # Test 1: Login and token structure
        access_token, refresh_token, username = self.test_login_and_token_structure()
        
        if not refresh_token:
            print("\n❌ Cannot proceed without valid tokens")
            return
        
        # Test 2: Immediate refresh
        new_access, new_refresh = self.test_immediate_refresh(refresh_token)
        
        # Test 3: Django-level validation
        self.test_django_level_validation(refresh_token, username)
        
        # Test 4: Configuration validation
        self.test_jwt_configuration()
        
        # Test 5: Multiple refreshes
        if new_refresh:
            self.test_multiple_refreshes(new_refresh)
        
        print("\n" + "=" * 60)
        print("🎯 Test Suite Complete")

if __name__ == "__main__":
    test_suite = JWTTestSuite()
    test_suite.run_all_tests()
