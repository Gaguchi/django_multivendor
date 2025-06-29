#!/usr/bin/env python3
"""
Quick diagnostic script to check JWT token behavior on production
"""

import requests
import json
import base64
from datetime import datetime
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

API_BASE_URL = "https://api.bazro.ge"

def decode_jwt_payload(token):
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
        payload = parts[1]
        payload += '=' * (4 - len(payload) % 4)
        decoded = base64.urlsafe_b64decode(payload)
        return json.loads(decoded)
    except Exception as e:
        return None

def main():
    session = requests.Session()
    
    print("🔬 JWT Token Diagnostic Test")
    print("=" * 40)
    
    # Login and get tokens
    login_data = {"login": "testvendor@bazro.ge", "password": "Test123!"}
    
    response = session.post(
        f"{API_BASE_URL}/api/users/login/",
        json=login_data,
        verify=False,
        timeout=30
    )
    
    if response.status_code != 200:
        print("❌ Login failed")
        return
    
    data = response.json()
    access_token = data['access']
    refresh_token = data['refresh']
    
    print("✅ Login successful")
    
    # Analyze tokens
    access_payload = decode_jwt_payload(access_token)
    refresh_payload = decode_jwt_payload(refresh_token)
    
    print(f"\n📊 Access Token Analysis:")
    if access_payload:
        print(f"   - Expires: {datetime.fromtimestamp(access_payload.get('exp', 0))}")
        print(f"   - Issued: {datetime.fromtimestamp(access_payload.get('iat', 0))}")
        print(f"   - JTI: {access_payload.get('jti', 'N/A')}")
        print(f"   - User ID: {access_payload.get('user_id', 'N/A')}")
    
    print(f"\n📊 Refresh Token Analysis:")
    if refresh_payload:
        print(f"   - Expires: {datetime.fromtimestamp(refresh_payload.get('exp', 0))}")
        print(f"   - Issued: {datetime.fromtimestamp(refresh_payload.get('iat', 0))}")
        print(f"   - JTI: {refresh_payload.get('jti', 'N/A')}")
        print(f"   - User ID: {refresh_payload.get('user_id', 'N/A')}")
    
    # Test immediate refresh
    print(f"\n🔄 Testing Token Refresh (attempt 1):")
    refresh_response = session.post(
        f"{API_BASE_URL}/api/token/refresh/",
        json={"refresh": refresh_token},
        verify=False,
        timeout=30
    )
    
    print(f"   Status: {refresh_response.status_code}")
    if refresh_response.status_code == 200:
        print("   ✅ Refresh successful!")
        refresh_data = refresh_response.json()
        print(f"   Response fields: {list(refresh_data.keys())}")
        
        # Check if we got enhanced response
        if 'token_type' in refresh_data and 'expires_in' in refresh_data:
            print("   🎉 Enhanced response format detected!")
            print(f"   Token type: {refresh_data.get('token_type')}")
            print(f"   Expires in: {refresh_data.get('expires_in')} seconds")
            print(f"   Issued at: {refresh_data.get('issued_at', 'N/A')}")
        
        # Try to use the new token
        new_access = refresh_data.get('access')
        if new_access:
            print(f"\n🧪 Testing API call with new token:")
            test_response = session.get(
                f"{API_BASE_URL}/api/vendors/profile/",
                headers={"Authorization": f"Bearer {new_access}"},
                verify=False,
                timeout=30
            )
            print(f"   API call status: {test_response.status_code}")
            if test_response.status_code == 200:
                print("   ✅ API call with new token successful!")
            else:
                print("   ❌ API call with new token failed")
                try:
                    error = test_response.json()
                    print(f"   Error: {error}")
                except:
                    print(f"   Error text: {test_response.text[:200]}")
        
    else:
        print("   ❌ Refresh failed")
        try:
            error_data = refresh_response.json()
            print(f"   Error details: {json.dumps(error_data, indent=6)}")
        except:
            print(f"   Error text: {refresh_response.text[:200]}")
    
    # Test with a fresh login and immediate refresh
    print(f"\n🔄 Testing Fresh Login + Immediate Refresh:")
    
    response2 = session.post(
        f"{API_BASE_URL}/api/users/login/",
        json=login_data,
        verify=False,
        timeout=30
    )
    
    if response2.status_code == 200:
        data2 = response2.json()
        fresh_refresh = data2['refresh']
        
        refresh_response2 = session.post(
            f"{API_BASE_URL}/api/token/refresh/",
            json={"refresh": fresh_refresh},
            verify=False,
            timeout=30
        )
        
        print(f"   Fresh refresh status: {refresh_response2.status_code}")
        if refresh_response2.status_code == 200:
            print("   ✅ Fresh token refresh successful!")
            fresh_data = refresh_response2.json()
            print(f"   Response fields: {list(fresh_data.keys())}")
        else:
            print("   ❌ Fresh token refresh also failed")
            try:
                error_data = refresh_response2.json()
                print(f"   Error: {json.dumps(error_data, indent=6)}")
            except:
                print(f"   Error text: {refresh_response2.text[:200]}")

if __name__ == "__main__":
    main()
