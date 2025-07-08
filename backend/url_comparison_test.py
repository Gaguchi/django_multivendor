#!/usr/bin/env python
"""
URL Test - Show the difference between sorted and hierarchical views
"""

import os
import sys
import django

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_multivendor.settings')
django.setup()

from categories.models import Category
from categories.admin import CategoryAdmin
from django.test import RequestFactory
from django.contrib.admin.sites import AdminSite
from django.http import QueryDict

def compare_urls():
    """Compare the output of different URLs"""
    
    admin_site = AdminSite()
    category_admin = CategoryAdmin(Category, admin_site)
    factory = RequestFactory()
    
    print("🔗 URL Comparison Test")
    print("=" * 80)
    
    urls_to_test = [
        ("Clean URL (Hierarchical)", "/admin/categories/category/", ""),
        ("With Sort Parameter", "/admin/categories/category/", "o=1"),
        ("Current Admin URL", "/admin/categories/category/", "o=5.-1"),
    ]
    
    for title, path, query_string in urls_to_test:
        print(f"\n📋 {title}")
        print(f"   URL: {path}{'?' + query_string if query_string else ''}")
        print("   " + "-" * 60)
        
        # Create request
        full_url = path + ('?' + query_string if query_string else '')
        request = factory.get(full_url)
        request.GET = QueryDict(query_string)
        
        # Get queryset
        queryset = category_admin.get_queryset(request)
        categories = list(queryset[:15])  # First 15 categories
        
        # Show results
        for i, cat in enumerate(categories):
            level = category_admin.get_category_level(cat)
            indent = "    " + "  " * level
            print(f"   {i+1:2d}.{indent}[L{level}] {cat.name}")
    
    print("\n" + "=" * 80)
    print("💡 Key Points:")
    print("   - Clean URL shows hierarchical order (parents → children)")
    print("   - URLs with 'o=' parameter show sorted order")
    print("   - Click column headers to sort, remove '?o=...' to see hierarchy")

if __name__ == "__main__":
    compare_urls()
