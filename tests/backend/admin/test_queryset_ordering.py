#!/usr/bin/env python
"""
Test script to verify hierarchical ordering with and without sort parameters.
"""

import os
import sys
import django

# Add the Django project to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_multivendor.settings')
django.setup()

from categories.models import Category
from categories.admin import CategoryAdmin
from django.test import RequestFactory
from django.contrib.admin.sites import AdminSite
from django.http import QueryDict

def test_queryset_with_params():
    """Test queryset ordering with different URL parameters"""
    
    # Create admin instance
    admin_site = AdminSite()
    category_admin = CategoryAdmin(Category, admin_site)
    factory = RequestFactory()
    
    print("🧪 Testing queryset ordering with different parameters...")
    print("=" * 60)
    
    # Test 1: No parameters (should be hierarchical)
    print("\n1️⃣ Testing with NO parameters (should be hierarchical):")
    request = factory.get('/admin/categories/category/')
    request.GET = QueryDict('')
    queryset = category_admin.get_queryset(request)
    categories = list(queryset[:10])  # Get first 10
    
    for i, cat in enumerate(categories):
        level = category_admin.get_category_level(cat)
        indent = "  " * level
        print(f"   {i+1:2d}. {indent}[L{level}] {cat.name}")
    
    # Test 2: With sort parameters (should be alphabetical)
    print("\n2️⃣ Testing with SORT parameters (should be alphabetical):")
    request = factory.get('/admin/categories/category/?o=1')
    qd = QueryDict('o=1')
    request.GET = qd
    queryset = category_admin.get_queryset(request)
    categories = list(queryset[:10])  # Get first 10
    
    for i, cat in enumerate(categories):
        level = category_admin.get_category_level(cat)
        indent = "  " * level
        print(f"   {i+1:2d}. {indent}[L{level}] {cat.name}")
    
    # Test 3: With search query (should be alphabetical)
    print("\n3️⃣ Testing with SEARCH query (should be alphabetical):")
    request = factory.get('/admin/categories/category/?q=test')
    qd = QueryDict('q=test')
    request.GET = qd
    queryset = category_admin.get_queryset(request)
    categories = list(queryset[:10])  # Get first 10
    
    for i, cat in enumerate(categories):
        level = category_admin.get_category_level(cat)
        indent = "  " * level
        print(f"   {i+1:2d}. {indent}[L{level}] {cat.name}")
    
    print("\n" + "=" * 60)
    print("✅ Queryset testing complete!")

def main():
    """Main test function"""
    print("🔍 Testing Category Admin Queryset Behavior")
    print("=" * 60)
    
    try:
        test_queryset_with_params()
        
        print("\n💡 Expected behavior:")
        print("   - No params: Hierarchical order (parents before children)")
        print("   - Sort params: Django's default ordering (usually alphabetical)")
        print("   - Search query: Django's default ordering for search results")
        
    except Exception as e:
        print(f"❌ Error during testing: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
