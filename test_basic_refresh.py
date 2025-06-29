#!/usr/bin/env python3
"""
Test if the basic token refresh works vs enhanced version
"""

import requests
import json
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
API_BASE_URL = "https://api.bazro.ge"

def test_basic_vs_enhanced():
    session = requests.Session()
    
    # Login first
    login_data = {"login": "testvendor@bazro.ge", "password": "Test123!"}
    response = session.post(f"{API_BASE_URL}/api/users/login/", json=login_data, verify=False)
    
    if response.status_code != 200:
        print("❌ Login failed")
        return
    
    data = response.json()
    refresh_token = data['refresh']
    print("✅ Login successful, got refresh token")
    
    # Test 1: Try the basic DRF token endpoint first
    print("\n🧪 Testing basic DRF token endpoint:")
    basic_response = session.post(
        f"{API_BASE_URL}/api/token/refresh/",
        json={"refresh": refresh_token},
        verify=False
    )
    
    print(f"Status: {basic_response.status_code}")
    if basic_response.status_code == 200:
        basic_data = basic_response.json()
        print(f"✅ Basic refresh successful!")
        print(f"Response fields: {list(basic_data.keys())}")
        
        # Check if it has enhanced fields
        if 'token_type' in basic_data:
            print("🎉 Enhanced fields present in basic endpoint!")
        else:
            print("ℹ️ Standard DRF response format")
    else:
        print("❌ Basic refresh failed")
        try:
            error = basic_response.json()
            print(f"Error: {json.dumps(error, indent=2)}")
        except:
            print(f"Error text: {basic_response.text[:200]}")

if __name__ == "__main__":
    test_basic_vs_enhanced()
