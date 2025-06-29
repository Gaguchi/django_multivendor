#!/usr/bin/env python3
"""
Test script for Enhanced JWT Token Refresh Implementation

This script tests the new enhanced token refresh endpoint and verifies:
1. Token refresh functionality
2. Error handling improvements
3. Rate limiting
4. Enhanced response format
"""

import requests
import json
import time
from datetime import datetime, timedelta
import urllib3

# Disable SSL warnings for development
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

API_BASE_URL = "https://api.bazro.ge"

class TokenRefreshTester:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name, success, message, details=None):
        """Log test result"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat(),
            'details': details
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        print(f"   {message}")
        if details:
            print(f"   Details: {details}")
        print()
    
    def test_api_connection(self):
        """Test basic API connectivity"""
        try:
            print(f"   Testing connection to: {API_BASE_URL}")
            response = self.session.get(f"{API_BASE_URL}/api/endpoints/", timeout=10)
            if response.status_code == 200:
                self.log_test(
                    "API Connection", 
                    True, 
                    f"Successfully connected to API at {API_BASE_URL}",
                    {"status_code": response.status_code}
                )
                return True
            else:
                self.log_test(
                    "API Connection", 
                    False, 
                    f"API returned status {response.status_code}",
                    {"status_code": response.status_code, "response": response.text[:200]}
                )
                return False
        except Exception as e:
            self.log_test(
                "API Connection", 
                False, 
                f"Failed to connect to API at {API_BASE_URL}",
                {"error": str(e)}
            )
            return False
    
    def test_login_and_get_tokens(self):
        """Test login to get initial tokens"""
        # Try a few different test account combinations
        test_accounts = [
            {
                "login": "testvendor@bazro.ge",
                "password": "Test123!"
            },
            {
                "login": "vendor@example.com", 
                "password": "vendorpass123"
            },
            {
                "login": "admin2",
                "password": "admin2password"
            }
        ]
        
        for i, login_data in enumerate(test_accounts):
            try:
                print(f"   Trying account {i+1}: {login_data['login']}")
                response = self.session.post(
                    f"{API_BASE_URL}/api/users/login/",
                    json=login_data,
                    headers={"Content-Type": "application/json"},
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if 'access' in data and 'refresh' in data:
                        self.access_token = data['access']
                        self.refresh_token = data['refresh']
                        self.log_test(
                            "Login and Token Retrieval", 
                            True, 
                            f"Successfully obtained tokens with {login_data['login']}",
                            {"has_access": bool(data.get('access')), "has_refresh": bool(data.get('refresh'))}
                        )
                        return True
                    else:
                        print(f"   Account {i+1} login response missing tokens: {list(data.keys())}")
                else:
                    print(f"   Account {i+1} login failed with status {response.status_code}")
                    
            except Exception as e:
                print(f"   Account {i+1} login request failed: {str(e)}")
        
        # If all accounts fail
        self.log_test(
            "Login and Token Retrieval", 
            False, 
            "All test accounts failed to login. Please check if valid test credentials are available.",
            {"tested_accounts": [acc["login"] for acc in test_accounts]}
        )
        return False
    
    def test_enhanced_token_refresh(self):
        """Test the enhanced token refresh endpoint"""
        if not hasattr(self, 'refresh_token'):
            self.log_test(
                "Enhanced Token Refresh", 
                False, 
                "No refresh token available for testing",
                None
            )
            return False
        
        try:
            refresh_data = {"refresh": self.refresh_token}
            response = self.session.post(
                f"{API_BASE_URL}/api/token/refresh/",
                json=refresh_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Check for enhanced response format
                expected_fields = ['access', 'token_type', 'expires_in', 'issued_at']
                has_enhanced_fields = all(field in data for field in expected_fields)
                
                if has_enhanced_fields:
                    self.new_access_token = data['access']
                    self.log_test(
                        "Enhanced Token Refresh", 
                        True, 
                        "Token refresh successful with enhanced response format",
                        {
                            "response_fields": list(data.keys()),
                            "token_type": data.get('token_type'),
                            "expires_in": data.get('expires_in')
                        }
                    )
                    return True
                else:
                    self.log_test(
                        "Enhanced Token Refresh", 
                        False, 
                        "Token refresh successful but missing enhanced fields",
                        {
                            "response_fields": list(data.keys()),
                            "missing_fields": [f for f in expected_fields if f not in data]
                        }
                    )
                    return False
            else:
                error_data = None
                try:
                    error_data = response.json()
                except:
                    error_data = response.text
                
                self.log_test(
                    "Enhanced Token Refresh", 
                    False, 
                    f"Token refresh failed with status {response.status_code}",
                    {"error": error_data}
                )
                return False
                
        except Exception as e:
            self.log_test(
                "Enhanced Token Refresh", 
                False, 
                "Token refresh request failed",
                {"error": str(e)}
            )
            return False
    
    def test_api_call_with_new_token(self):
        """Test API call with the new token"""
        if not hasattr(self, 'new_access_token'):
            self.log_test(
                "API Call with New Token", 
                False, 
                "No new access token available for testing",
                None
            )
            return False
        
        try:
            headers = {
                "Authorization": f"Bearer {self.new_access_token}",
                "Content-Type": "application/json"
            }
            
            response = self.session.get(
                f"{API_BASE_URL}/api/vendors/profile/",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                self.log_test(
                    "API Call with New Token", 
                    True, 
                    "Successfully made API call with refreshed token",
                    {"status_code": response.status_code}
                )
                return True
            else:
                error_data = None
                try:
                    error_data = response.json()
                except:
                    error_data = response.text
                
                self.log_test(
                    "API Call with New Token", 
                    False, 
                    f"API call failed with status {response.status_code}",
                    {"error": error_data}
                )
                return False
                
        except Exception as e:
            self.log_test(
                "API Call with New Token", 
                False, 
                "API call request failed",
                {"error": str(e)}
            )
            return False
    
    def test_invalid_refresh_token(self):
        """Test error handling with invalid refresh token"""
        try:
            refresh_data = {"refresh": "invalid_token_12345"}
            response = self.session.post(
                f"{API_BASE_URL}/api/token/refresh/",
                json=refresh_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 401:
                data = response.json()
                
                # Check for enhanced error response
                has_error_code = 'error_code' in data
                has_detailed_error = 'error' in data or 'detail' in data
                
                if has_error_code and has_detailed_error:
                    self.log_test(
                        "Invalid Refresh Token Handling", 
                        True, 
                        "Properly handled invalid refresh token with enhanced error response",
                        {
                            "error_code": data.get('error_code'),
                            "error": data.get('error', data.get('detail')),
                            "status_code": response.status_code
                        }
                    )
                    return True
                else:
                    self.log_test(
                        "Invalid Refresh Token Handling", 
                        False, 
                        "Invalid token handled but missing enhanced error fields",
                        {"response": data}
                    )
                    return False
            else:
                self.log_test(
                    "Invalid Refresh Token Handling", 
                    False, 
                    f"Expected 401 status but got {response.status_code}",
                    {"status_code": response.status_code}
                )
                return False
                
        except Exception as e:
            self.log_test(
                "Invalid Refresh Token Handling", 
                False, 
                "Invalid token test request failed",
                {"error": str(e)}
            )
            return False
    
    def test_rate_limiting(self):
        """Test rate limiting (if enabled)"""
        if not hasattr(self, 'refresh_token'):
            self.log_test(
                "Rate Limiting Test", 
                False, 
                "No refresh token available for rate limiting test",
                None
            )
            return False
        
        try:
            refresh_data = {"refresh": self.refresh_token}
            rate_limit_hit = False
            
            # Make 15 rapid requests to trigger rate limiting
            for i in range(15):
                response = self.session.post(
                    f"{API_BASE_URL}/api/token/refresh/",
                    json=refresh_data,
                    headers={"Content-Type": "application/json"},
                    timeout=5
                )
                
                if response.status_code == 429:
                    rate_limit_hit = True
                    data = response.json()
                    self.log_test(
                        "Rate Limiting Test", 
                        True, 
                        f"Rate limiting triggered after {i+1} requests",
                        {
                            "status_code": response.status_code,
                            "error": data.get('error'),
                            "retry_after": data.get('retry_after')
                        }
                    )
                    return True
                
                # Small delay between requests
                time.sleep(0.1)
            
            if not rate_limit_hit:
                self.log_test(
                    "Rate Limiting Test", 
                    False, 
                    "Rate limiting was not triggered after 15 requests",
                    {"requests_made": 15}
                )
                return False
                
        except Exception as e:
            self.log_test(
                "Rate Limiting Test", 
                False, 
                "Rate limiting test failed",
                {"error": str(e)}
            )
            return False
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting Enhanced Token Refresh Test Suite")
        print("=" * 50)
        
        tests = [
            self.test_api_connection,
            self.test_login_and_get_tokens,
            self.test_enhanced_token_refresh,
            self.test_api_call_with_new_token,
            self.test_invalid_refresh_token,
            self.test_rate_limiting,
        ]
        
        for test in tests:
            test()
        
        # Print summary
        print("📊 Test Results Summary")
        print("=" * 30)
        
        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if passed == total:
            print("\n🎉 All tests passed! Enhanced token refresh is working correctly.")
        else:
            print(f"\n⚠️  {total - passed} test(s) failed. Please review the implementation.")
        
        # Save detailed results
        with open('token_refresh_test_results.json', 'w') as f:
            json.dump(self.test_results, f, indent=2)
        
        print(f"\n📁 Detailed results saved to: token_refresh_test_results.json")

if __name__ == "__main__":
    tester = TokenRefreshTester()
    tester.run_all_tests()
