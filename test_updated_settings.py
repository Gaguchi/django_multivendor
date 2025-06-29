#!/usr/bin/env python
"""
Test with the updated settings
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

from django.conf import settings

def check_current_settings():
    print("🔧 Current JWT Settings After Update:")
    print("=" * 50)
    
    jwt_settings = settings.SIMPLE_JWT
    print(f"🔄 ROTATE_REFRESH_TOKENS: {jwt_settings.get('ROTATE_REFRESH_TOKENS')}")
    print(f"⚫ BLACKLIST_AFTER_ROTATION: {jwt_settings.get('BLACKLIST_AFTER_ROTATION')}")
    print(f"🗝️ USE_BLACKLIST: {jwt_settings.get('USE_BLACKLIST')}")
    
    # Test with fresh token
    print(f"\n🧪 Testing with fresh token after settings change...")
    
    test_account = {"username": "testvendor@bazro.ge", "password": "Test123!"}
    
    try:
        # Login
        login_response = requests.post(
            "https://api.bazro.ge/api/token/", 
            json=test_account, 
            verify=False,
            timeout=10
        )
        
        if login_response.status_code == 200:
            data = login_response.json()
            refresh_token = data['refresh']
            print(f"✅ Got fresh token")
            
            # Immediate refresh test
            refresh_response = requests.post(
                "https://api.bazro.ge/api/token/refresh/", 
                json={"refresh": refresh_token},
                verify=False,
                timeout=10
            )
            
            print(f"📡 Refresh status: {refresh_response.status_code}")
            
            if refresh_response.status_code == 200:
                print(f"🎉 SUCCESS! Token refresh worked!")
                refresh_data = refresh_response.json()
                print(f"📊 Response keys: {list(refresh_data.keys())}")
            else:
                print(f"❌ Still failing")
                try:
                    error_data = refresh_response.json()
                    print(f"📄 Error: {error_data}")
                except:
                    print(f"📄 Error text: {refresh_response.text}")
        else:
            print(f"❌ Login failed: {login_response.text}")
            
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    check_current_settings()
