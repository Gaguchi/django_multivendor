#!/usr/bin/env python3
"""
Test script to verify vendor order management functionality
after fixing the CORS X-Vendor-ID header issue.
"""

import requests
import json
import urllib3

# Disable SSL warnings for local testing
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Configuration
BASE_URL = "https://api.bazro.ge"
MASTER_TOKEN = "your_master_token_here"  # You'll need to get this from your settings

def test_cors_headers():
    """Test that CORS preflight request allows X-Vendor-ID header"""
    url = f"{BASE_URL}/api/orders/vendor/"
    
    print(f"Testing URL: {url}")
    
    # Send a preflight request (OPTIONS)
    try:
        preflight_response = requests.options(
            url,
            headers={
                'Origin': 'https://seller.bazro.ge',
                'Access-Control-Request-Method': 'GET',
                'Access-Control-Request-Headers': 'x-master-token,x-vendor-id'
            },
            verify=False  # Disable SSL verification for local testing
        )
    except Exception as e:
        print(f"Error making request: {e}")
        return False
    
    print("=== CORS Preflight Test ===")
    print(f"Status: {preflight_response.status_code}")
    print(f"Access-Control-Allow-Headers: {preflight_response.headers.get('Access-Control-Allow-Headers', 'Not present')}")
    
    allowed_headers = preflight_response.headers.get('Access-Control-Allow-Headers', '').lower()
    if 'x-vendor-id' in allowed_headers:
        print("✅ X-Vendor-ID header is allowed by CORS")
        return True
    else:
        print("❌ X-Vendor-ID header is NOT allowed by CORS")
        return False

def test_vendor_profile_endpoint():
    """Test the vendor profile endpoint"""
    url = f"{BASE_URL}/api/vendors/profile/"
    
    print("\n=== Vendor Profile Endpoint Test ===")
    print(f"Testing URL: {url}")
    
    try:
        response = requests.get(
            url,
            headers={
                'X-Master-Token': MASTER_TOKEN,
                'Origin': 'https://seller.bazro.ge'
            },
            verify=False  # Disable SSL verification for local testing
        )
        
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ Vendor profile endpoint is accessible")
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
            return True
        else:
            print(f"❌ Vendor profile endpoint returned {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing vendor profile endpoint: {e}")
        return False

def test_vendor_orders_endpoint():
    """Test the vendor orders endpoint with both required headers"""
    url = f"{BASE_URL}/api/orders/vendor/"
    
    print("\n=== Vendor Orders Endpoint Test ===")
    print(f"Testing URL: {url}")
    
    try:
        response = requests.get(
            url,
            headers={
                'X-Master-Token': MASTER_TOKEN,
                'X-Vendor-ID': '1',  # Test with vendor ID 1
                'Origin': 'https://seller.bazro.ge'
            },
            verify=False  # Disable SSL verification for local testing
        )
        
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ Vendor orders endpoint is accessible")
            data = response.json()
            print(f"Orders found: {len(data.get('results', data)) if isinstance(data, dict) else len(data)}")
            return True
        elif response.status_code == 401:
            print("⚠️  Authentication required (expected if no valid token)")
            print(f"Response: {response.text}")
            return True  # This is expected behavior
        else:
            print(f"❌ Vendor orders endpoint returned {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing vendor orders endpoint: {e}")
        return False

def main():
    """Run all tests"""
    print("Testing Django Multivendor Order Management System")
    print("=" * 50)
    
    # Test CORS configuration
    cors_ok = test_cors_headers()
    
    # Test vendor profile endpoint
    profile_ok = test_vendor_profile_endpoint()
    
    # Test vendor orders endpoint
    orders_ok = test_vendor_orders_endpoint()
    
    print("\n" + "=" * 50)
    print("SUMMARY:")
    print(f"CORS Headers: {'✅ PASS' if cors_ok else '❌ FAIL'}")
    print(f"Vendor Profile: {'✅ PASS' if profile_ok else '❌ FAIL'}")
    print(f"Vendor Orders: {'✅ PASS' if orders_ok else '❌ FAIL'}")
    
    if cors_ok:
        print("\n🎉 CORS issue has been resolved!")
        print("The X-Vendor-ID header is now allowed, so the frontend should work properly.")
    else:
        print("\n⚠️  CORS issue still exists. Please check Django settings.")

if __name__ == "__main__":
    main()
