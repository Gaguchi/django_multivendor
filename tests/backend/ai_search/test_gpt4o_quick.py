#!/usr/bin/env python3
"""
Quick test script for GPT-4o AI search integration
Tests the backend API to ensure it's working with GitHub Copilot
"""

import requests
import json
import os
from pathlib import Path

def test_gpt4o_search():
    """Test the GPT-4o search endpoint"""
    
    print("🧪 Testing GPT-4o AI Search Integration")
    print("=" * 45)
    
    # Test endpoint
    api_url = "http://localhost:8000/api/ai/search/"
    
    # Test queries
    test_queries = [
        "wireless bluetooth headphones under $100",
        "gaming laptops for students", 
        "home decoration items",
        "electronics under 50 dollars"
    ]
    
    for i, query in enumerate(test_queries, 1):
        print(f"\n🔍 Test {i}/4: '{query}'")
        print("-" * 30)
        
        try:
            response = requests.post(
                api_url,
                json={"query": query},
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                
                print(f"✅ Status: {response.status_code}")
                print(f"🎯 Method: {data.get('search_method', 'unknown')}")
                print(f"📊 Results: {data.get('total_count', 0)}")
                print(f"🏷️  Tags: {data.get('relevant_tags', [])}")
                print(f"⚡ Time: {data.get('response_time_ms', 0)}ms")
                
                # Check if GPT-4o was used
                if data.get('search_method') == 'gpt4o':
                    print("🎉 GPT-4o working perfectly!")
                elif data.get('search_method') == 'manual':
                    print("⚠️  Fallback to manual (GPT-4o may not be configured)")
                else:
                    print(f"ℹ️  Using method: {data.get('search_method')}")
                    
            else:
                print(f"❌ Error: {response.status_code}")
                print(f"   Response: {response.text}")
                
        except requests.exceptions.ConnectionError:
            print("❌ Connection Error: Is Django server running on port 8000?")
            break
        except Exception as e:
            print(f"❌ Error: {e}")
    
    print("\n" + "=" * 45)
    print("🏁 Test Complete!")
    print()
    print("💡 Tips:")
    print("  - If seeing 'manual' method, check GitHub token in .env")
    print("  - If connection errors, ensure Django server is running")
    print("  - Check Django logs for detailed error messages")
    print()

def test_health_check():
    """Test the AI health check endpoint"""
    
    print("🏥 Testing AI Service Health")
    print("-" * 30)
    
    try:
        response = requests.get("http://localhost:8000/api/ai/health/", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Health check passed")
            print(f"   Status: {data.get('status', 'unknown')}")
            print(f"   Service: {data.get('service_available', False)}")
            
            # Check specific components
            if 'github_token_configured' in data:
                if data['github_token_configured']:
                    print("✅ GitHub token configured")
                else:
                    print("❌ GitHub token not configured")
                    
            if 'copilot_access' in data:
                if data['copilot_access']:
                    print("✅ Copilot access working")
                else:
                    print("❌ Copilot access failed")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Health check error: {e}")

if __name__ == "__main__":
    # Test health first
    test_health_check()
    print()
    
    # Then test search functionality
    test_gpt4o_search()
