#!/usr/bin/env python3
"""
Debug script to understand token issues with the live API
"""

import requests
import json
import jwt
import base64
from datetime import datetime
import urllib3

# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

API_BASE_URL = "https://api.bazro.ge"

def decode_jwt_payload(token):
    """Decode JWT payload without verification"""
    try:
        # JWT tokens have 3 parts: header.payload.signature
        parts = token.split('.')
        if len(parts) != 3:
            return None
        
        # Decode the payload (second part)
        payload = parts[1]
        # Add padding if needed
        payload += '=' * (4 - len(payload) % 4)
        decoded = base64.urlsafe_b64decode(payload)
        return json.loads(decoded)
    except Exception as e:
        print(f"Error decoding token: {e}")
        return None

def test_login_and_tokens():
    """Test login and analyze tokens"""
    
    # Test accounts
    test_accounts = [
        {"username": "testvendor@bazro.ge", "password": "Test123!"},
        {"username": "vendor@example.com", "password": "vendorpass123"},
        {"username": "admin2", "password": "admin2password"}
    ]
    
    session = requests.Session()
    
    print("🔍 Testing login and analyzing tokens...")
    print("=" * 50)
    
    for i, account in enumerate(test_accounts):
        try:
            print(f"\n📝 Testing account {i+1}: {account['username']}")
            
            response = session.post(
                f"{API_BASE_URL}/api/users/login/",
                json={"login": account['username'], "password": account['password']},
                verify=False,
                timeout=30
            )
            
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"   Response keys: {list(data.keys())}")
                
                if 'access' in data and 'refresh' in data:
                    access_token = data['access']
                    refresh_token = data['refresh']
                    
                    print(f"   ✅ Got tokens!")
                    print(f"   📊 Access token length: {len(access_token)}")
                    print(f"   📊 Refresh token length: {len(refresh_token)}")
                    
                    # Decode access token
                    access_payload = decode_jwt_payload(access_token)
                    if access_payload:
                        print(f"   🔍 Access token payload:")
                        print(f"      - Token type: {access_payload.get('token_type', 'N/A')}")
                        print(f"      - User ID: {access_payload.get('user_id', 'N/A')}")
                        print(f"      - Expires: {datetime.fromtimestamp(access_payload.get('exp', 0))}")
                        print(f"      - Issued: {datetime.fromtimestamp(access_payload.get('iat', 0))}")
                    
                    # Decode refresh token
                    refresh_payload = decode_jwt_payload(refresh_token)
                    if refresh_payload:
                        print(f"   🔍 Refresh token payload:")
                        print(f"      - Token type: {refresh_payload.get('token_type', 'N/A')}")
                        print(f"      - User ID: {refresh_payload.get('user_id', 'N/A')}")
                        print(f"      - Expires: {datetime.fromtimestamp(refresh_payload.get('exp', 0))}")
                        print(f"      - Issued: {datetime.fromtimestamp(refresh_payload.get('iat', 0))}")
                    
                    # Test immediate refresh
                    print(f"\n   🔄 Testing immediate refresh...")
                    refresh_response = session.post(
                        f"{API_BASE_URL}/api/token/refresh/",
                        json={"refresh": refresh_token},
                        verify=False,
                        timeout=30
                    )
                    
                    print(f"   Refresh status: {refresh_response.status_code}")
                    if refresh_response.status_code == 200:
                        refresh_data = refresh_response.json()
                        print(f"   ✅ Refresh successful!")
                        print(f"   📊 New access token length: {len(refresh_data.get('access', ''))}")
                        if 'refresh' in refresh_data:
                            print(f"   📊 New refresh token length: {len(refresh_data['refresh'])}")
                    else:
                        print(f"   ❌ Refresh failed!")
                        try:
                            error_data = refresh_response.json()
                            print(f"   Error: {json.dumps(error_data, indent=6)}")
                        except:
                            print(f"   Error text: {refresh_response.text}")
                    
                    return True  # Stop after first successful login
                    
            else:
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error text: {response.text}")
                    
        except Exception as e:
            print(f"   ❌ Exception: {e}")
    
    print(f"\n❌ All login attempts failed")
    return False

if __name__ == "__main__":
    test_login_and_tokens()
