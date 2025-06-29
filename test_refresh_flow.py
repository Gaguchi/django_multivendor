#!/usr/bin/env python
"""
Test the exact flow in EnhancedTokenRefreshView
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

from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework.test import APIClient
from rest_framework.request import Request
from rest_framework.test import APIRequestFactory
from users.views import EnhancedTokenRefreshView

def test_serializer_directly():
    print("🔍 Testing TokenRefreshSerializer Directly")
    print("=" * 60)
    
    # Get a token from the API
    test_account = {"username": "testvendor@bazro.ge", "password": "Test123!"}
    
    login_response = requests.post(
        "https://api.bazro.ge/api/token/", 
        json=test_account, 
        verify=False
    )
    
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.text}")
        return
    
    data = login_response.json()
    api_refresh_token = data['refresh']
    
    print(f"✅ Got refresh token from API")
    print(f"🎟️ Token: {api_refresh_token[:50]}...")
    
    # Step 1: Test the serializer directly
    print(f"\n🧪 Step 1: Testing TokenRefreshSerializer...")
    try:
        serializer = TokenRefreshSerializer(data={"refresh": api_refresh_token})
        is_valid = serializer.is_valid()
        print(f"📊 Serializer is_valid: {is_valid}")
        
        if is_valid:
            print(f"✅ Serializer validation passed")
            try:
                validated_data = serializer.validated_data
                print(f"📋 Validated data keys: {list(validated_data.keys())}")
                
                # Try to save/get the new tokens
                result = serializer.save()
                print(f"✅ Serializer save successful")
                print(f"📊 Result type: {type(result)}")
                print(f"📊 Result: {result}")
                
            except Exception as save_error:
                print(f"❌ Serializer save failed: {save_error}")
                print(f"📝 Error type: {type(save_error)}")
        else:
            print(f"❌ Serializer validation failed")
            print(f"📋 Errors: {serializer.errors}")
            
    except Exception as e:
        print(f"❌ Serializer creation failed: {e}")
        print(f"📝 Error type: {type(e)}")
    
    # Step 2: Test the original TokenRefreshView
    print(f"\n🧪 Step 2: Testing original TokenRefreshView...")
    try:
        factory = APIRequestFactory()
        request = factory.post('/api/token/refresh/', {"refresh": api_refresh_token})
        
        view = TokenRefreshView()
        view.request = request
        view.format_kwarg = None
        
        response = view.post(request)
        print(f"📡 Original view response status: {response.status_code}")
        
        if response.status_code == 200:
            print(f"✅ Original view successful")
            print(f"📊 Response data keys: {list(response.data.keys())}")
        else:
            print(f"❌ Original view failed")
            print(f"📄 Response: {response.data}")
            
    except Exception as e:
        print(f"❌ Original view failed: {e}")
        print(f"📝 Error type: {type(e)}")
    
    # Step 3: Test the EnhancedTokenRefreshView
    print(f"\n🧪 Step 3: Testing EnhancedTokenRefreshView...")
    try:
        factory = APIRequestFactory()
        request = factory.post('/api/token/refresh/', {"refresh": api_refresh_token})
        
        view = EnhancedTokenRefreshView()
        view.request = request
        view.format_kwarg = None
        
        response = view.post(request)
        print(f"📡 Enhanced view response status: {response.status_code}")
        
        if response.status_code == 200:
            print(f"✅ Enhanced view successful")
            print(f"📊 Response data keys: {list(response.data.keys())}")
        else:
            print(f"❌ Enhanced view failed")
            print(f"📄 Response: {response.data}")
            
    except Exception as e:
        print(f"❌ Enhanced view failed: {e}")
        print(f"📝 Error type: {type(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_serializer_directly()
