#!/usr/bin/env python
"""
Test script to verify how different URL parameters affect the queryset ordering.
"""

import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_multivendor.settings')
django.setup()

from django.contrib import admin
from categories.models import Category
from categories.admin import CategoryAdmin
from django.http import HttpRequest
from django.contrib.auth.models import User
from django.test import RequestFactory

def test_with_sort_params():
    """Test queryset with different sort parameters"""
    print("🔍 Testing Admin Queryset with Sort Parameters")
    print("=" * 60)
    
    factory = RequestFactory()
    
    # Test cases with different parameters
    test_cases = [
        ("No parameters", ""),
        ("Sort by name ascending", "?o=1"),
        ("Sort by name descending", "?o=-1"), 
        ("Sort by _reorder_", "?o=5"),
        ("Multiple sort", "?o=5.-1"),
        ("Search query", "?q=electronics"),
    ]
    
    category_admin = CategoryAdmin(Category, admin.site)
    
    for test_name, query_string in test_cases:
        print(f"\n📋 Test: {test_name} ({query_string})")
        
        # Create request with parameters
        request = factory.get(f"/admin/categories/category/{query_string}")
        request.user = User.objects.filter(is_superuser=True).first()
        
        if not request.user:
            request.user = User.objects.create_superuser('admin', 'admin@test.com', 'admin')
        
        try:
            queryset = category_admin.get_queryset(request)
            categories = list(queryset[:5])
            
            print(f"   📊 First 5 categories:")
            for i, cat in enumerate(categories, 1):
                level = category_admin.get_category_level(cat)
                print(f"     {i}. {'  ' * level}{cat.name} (L{level})")
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    print("\n" + "=" * 60)
    print("🔧 Recommendation:")
    print("   To see hierarchical ordering, visit the categories admin page")
    print("   WITHOUT any sort parameters, e.g.: /admin/categories/category/")
    print("   The hierarchical ordering is disabled when sorting or filtering.")

if __name__ == "__main__":
    test_with_sort_params()
