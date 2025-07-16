#!/usr/bin/env python3
"""
Test script for GPT-4o AI Search functionality
Run this to verify your Copilot integration is working
"""

import os
import sys
from pathlib import Path

def main():
    print("🧪 Testing GPT-4o AI Search Integration")
    print("=" * 40)
    print()
    
    # Check if we're in the right directory
    if not Path("backend/manage.py").exists():
        print("❌ Error: Please run this script from the project root directory")
        sys.exit(1)
    
    # Set up Django environment
    sys.path.insert(0, str(Path("backend").absolute()))
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_multivendor.settings')
    
    try:
        import django
        django.setup()
        print("✅ Django environment loaded")
    except Exception as e:
        print(f"❌ Failed to load Django: {e}")
        sys.exit(1)
    
    # Import and test the service
    try:
        from ai_search.gpt_service import gpt_ai_search_service
        print("✅ GPT AI Search service imported")
        
        # Check GitHub token configuration
        if gpt_ai_search_service.github_token:
            token = gpt_ai_search_service.github_token
            print(f"✅ GitHub token configured: {token[:4]}...{token[-4:]}")
        else:
            print("❌ No GitHub token found!")
            print("   Please run: python setup_copilot_ai.py")
            return
        
        # Test token acquisition
        print("\n🔑 Testing Copilot token acquisition...")
        copilot_token = gpt_ai_search_service.get_copilot_token()
        
        if copilot_token:
            print(f"✅ Successfully acquired Copilot token: {copilot_token[:8]}...{copilot_token[-8:]}")
        else:
            print("❌ Failed to acquire Copilot token")
            print("   Check your GitHub token and Copilot subscription")
            return
        
        # Test GPT-4o query
        print("\n🤖 Testing GPT-4o query...")
        test_prompt = "Extract relevant product tags from this query: wireless headphones"
        response = gpt_ai_search_service.query_gpt4o(test_prompt)
        
        if response:
            print(f"✅ GPT-4o response received: {response[:100]}...")
        else:
            print("❌ No response from GPT-4o")
            return
        
        # Test full search
        print("\n🔍 Testing full AI search...")
        search_results = gpt_ai_search_service.search_products(
            query="electronics under 100 dollars",
            user_ip="127.0.0.1"
        )
        
        if search_results and not search_results.get('error'):
            print("✅ AI search completed successfully!")
            print(f"   Query: {search_results.get('query')}")
            print(f"   Method: {search_results.get('search_method')}")
            print(f"   Results: {search_results.get('total_count', 0)}")
            print(f"   Tags: {search_results.get('relevant_tags', [])}")
            print(f"   Response time: {search_results.get('response_time_ms')}ms")
            
            # Show sample results
            results = search_results.get('results', [])
            if results:
                print(f"\n📦 Sample results ({min(3, len(results))}):")
                for i, product in enumerate(results[:3]):
                    print(f"   {i+1}. {product.get('name', 'Unknown')} - ${product.get('price', 0)}")
                    print(f"      Score: {product.get('match_score', 0)}, Tags: {product.get('matched_tags', [])}")
        else:
            print("❌ AI search failed")
            if search_results:
                print(f"   Error: {search_results.get('error', 'Unknown error')}")
        
        print("\n🎉 Test Complete!")
        print("-" * 20)
        print("Your GPT-4o AI search integration is working!")
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("   Make sure all dependencies are installed")
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
