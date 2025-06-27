#!/usr/bin/env python3
"""
Test script for AI Search API
Similar to the standalone Python script but tests the Django API
"""

import requests
import json
import sys

# API endpoint
API_URL = "https://api.bazro.ge/api/ai/search/"

def test_ai_search(query, max_results=10):
    """Test the AI search API"""
    print(f"Testing AI search with query: '{query}'")
    
    try:
        # Make API request
        response = requests.post(
            API_URL,
            json={
                "query": query,
                "max_results": max_results
            },
            headers={
                "Content-Type": "application/json"
            },
            timeout=30
        )
        
        print(f"Response status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            print(f"Search completed in {data.get('response_time_ms', 0)}ms")
            print(f"Search method: {data.get('search_method', 'unknown')}")
            print(f"Found {data.get('total_count', 0)} results")
            
            if data.get('relevant_tags'):
                print(f"Relevant tags: {', '.join(data['relevant_tags'])}")
            
            if data.get('warning'):
                print(f"Warning: {data['warning']}")
            
            results = data.get('results', [])
            
            if results:
                print(f"\nTop {len(results)} results:")
                for i, product in enumerate(results, 1):
                    price = f"${product['price']:.2f}"
                    if product.get('old_price') and product['old_price'] > product['price']:
                        price += f" (was ${product['old_price']:.2f})"
                    
                    print(f"\n{i}. {product['name']} - {price}")
                    print(f"   Vendor: {product['vendor_name']}")
                    print(f"   Category: {product['category']}")
                    print(f"   Rating: {product['rating']:.1f}")
                    print(f"   Stock: {product['stock']}")
                    
                    if product.get('match_score'):
                        print(f"   Match Score: {product['match_score']}")
                    
                    if product.get('tags'):
                        print(f"   Tags: {', '.join(product['tags'])}")
            else:
                print("\nNo results found.")
                
        else:
            print(f"API Error: {response.status_code}")
            try:
                error_data = response.json()
                print(f"Error details: {error_data}")
            except:
                print(f"Response text: {response.text}")
                
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the API. Make sure Django server is running and Cloudflare tunnel is active")
        print("Expected API URL: https://api.bazro.ge")
    except requests.exceptions.Timeout:
        print("Error: Request timed out")
    except Exception as e:
        print(f"Error: {str(e)}")

def main():
    if len(sys.argv) < 2:
        print("Usage: python test_ai_search.py <search_query> [max_results]")
        print("Example: python test_ai_search.py 'electronics' 5")
        sys.exit(1)
    
    query = sys.argv[1]
    max_results = int(sys.argv[2]) if len(sys.argv) > 2 else 10
    
    test_ai_search(query, max_results)

if __name__ == "__main__":
    main()
