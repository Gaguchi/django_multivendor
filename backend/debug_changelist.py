#!/usr/bin/env python
"""
Debug script to test the hierarchical ordering in admin queryset.
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

def test_admin_queryset():
    """Test the admin queryset ordering"""
    print("🔍 Testing Hierarchical Admin Queryset Ordering")
    print("=" * 60)
    
    # Create a mock request
    request = HttpRequest()
    request.method = 'GET'
    request.GET = {}
    request.user = User.objects.filter(is_superuser=True).first()
    
    if not request.user:
        print("❌ No superuser found. Creating one...")
        request.user = User.objects.create_superuser('admin', 'admin@test.com', 'admin')
    
    # Create CategoryAdmin instance
    category_admin = CategoryAdmin(Category, admin.site)
    
    # Test get_queryset method
    print("\n📋 Test 1: Testing get_queryset method")
    try:
        queryset = category_admin.get_queryset(request)
        print(f"✅ Queryset created successfully")
        print(f"📊 Total categories in queryset: {queryset.count()}")
        
        # Show first 20 categories and their hierarchy
        categories = list(queryset[:20])
        print("\n🌳 Category ordering (first 20):")
        for i, category in enumerate(categories, 1):
            level = category_admin.get_category_level(category)
            parent_info = f" (parent: {category.parent_category.name})" if category.parent_category else " (root)"
            print(f"  {i:2d}. {'  ' * level}{category.name} (Level {level}){parent_info}")
            
    except Exception as e:
        print(f"❌ Error testing queryset: {e}")
        import traceback
        traceback.print_exc()
    
    # Test hierarchical ordering method directly
    print("\n📋 Test 2: Testing _get_hierarchical_order method")
    try:
        all_categories = list(Category.objects.select_related('parent_category').all())
        ordered_categories = category_admin._get_hierarchical_order(all_categories)
        
        print(f"✅ Hierarchical ordering created successfully")
        print(f"📊 Total categories: {len(ordered_categories)}")
        
        # Show first 20 categories in hierarchical order
        print("\n🌳 Hierarchical order (first 20):")
        for i, category in enumerate(ordered_categories[:20], 1):
            level = category_admin.get_category_level(category)
            parent_info = f" (parent: {category.parent_category.name})" if category.parent_category else " (root)"
            print(f"  {i:2d}. {'  ' * level}{category.name} (Level {level}){parent_info}")
            
    except Exception as e:
        print(f"❌ Error testing hierarchical order: {e}")
        import traceback
        traceback.print_exc()
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    test_admin_queryset()
