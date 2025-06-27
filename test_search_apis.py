#!/usr/bin/env python3
"""
Simple test script fodef test_search_suggestions():
    print("\n=== Testing Search Suggestions API ===")
    try:
        response = requests.get(
            'https://api.bazro.ge/api/search/suggestions/',
            params={'q': 'elect'},
            timeout=10
        ) APIs
"""
import requests
import json
import sys

def test_ai_search():
    print("=== Testing AI Search API ===")
    try:
        response = requests.post(
            'https://api.bazro.ge/api/ai/search/',
            json={'query': 'electronics', 'max_results': 3},
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Query: {data.get('query')}")
            print(f"Results count: {data.get('total_count', 0)}")
            print(f"Search method: {data.get('search_method')}")
            print(f"Response time: {data.get('response_time_ms')}ms")
            print("✅ AI Search API working!")
        else:
            print(f"❌ AI Search failed: {response.text}")
    except Exception as e:
        print(f"❌ AI Search error: {e}")

def test_ordinary_search():
    print("\n=== Testing Ordinary Search API ===")
    try:
        response = requests.get(
            'https://api.bazro.ge/api/search/',
            params={'q': 'electronics', 'per_page': 3},
            timeout=10
        )
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Query: {data.get('query')}")
            print(f"Results count: {len(data.get('results', []))}")
            print(f"Total count: {data.get('pagination', {}).get('total_count', 0)}")
            print("✅ Ordinary Search API working!")
        else:
            print(f"❌ Ordinary Search failed: {response.text}")
    except Exception as e:
        print(f"❌ Ordinary Search error: {e}")

def test_search_suggestions():
    print("\n=== Testing Search Suggestions API ===")
    try:
        response = requests.get(
            'https://api.bazro.ge/api/search/suggestions/',
            params={'q': 'elect'},
            timeout=10
        )
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Suggestions: {data.get('suggestions', [])}")
            print("✅ Search Suggestions API working!")
        else:
            print(f"❌ Search Suggestions failed: {response.text}")
    except Exception as e:
        print(f"❌ Search Suggestions error: {e}")

if __name__ == "__main__":
    print("🔍 Testing Search APIs...")
    test_ai_search()
    test_ordinary_search()
    test_search_suggestions()
    print("\n🎉 All tests completed!")
