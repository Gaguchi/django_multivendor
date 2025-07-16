#!/usr/bin/env python3
"""
Quick test script to check if products have review data in the API
"""
import requests
import json

# Test the products API
url = "https://api.bazro.ge/api/vendors/products/"
headers = {"X-Master-Token": "your-super-secret-token"}

try:
    response = requests.get(url, headers=headers)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        products = data.get('results', [])
        
        print(f"Found {len(products)} products")
        
        # Check first few products for review data
        for i, product in enumerate(products[:3]):
            print(f"\nProduct {i+1}:")
            print(f"  ID: {product.get('id')}")
            print(f"  Name: {product.get('name')}")
            print(f"  Average Rating: {product.get('average_rating')}")
            print(f"  Review Count: {product.get('review_count')}")
            print(f"  Rating (old field): {product.get('rating')}")
    else:
        print(f"Error: {response.text}")
        
except Exception as e:
    print(f"Error making request: {e}")
