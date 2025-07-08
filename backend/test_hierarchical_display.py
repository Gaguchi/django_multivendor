#!/usr/bin/env python
"""
Test script to verify hierarchical category display in Django admin.
This script creates test categories and verifies the hierarchical ordering.
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
from django.contrib.auth.models import User

def create_test_categories():
    """Create a test category hierarchy"""
    print("Creating test categories...")
    
    # Clean up existing test categories
    Category.objects.filter(name__startswith="Test").delete()
    
    # Create root categories
    electronics = Category.objects.create(
        name="Test Electronics",
        slug="test-electronics",
        display_order=1
    )
    
    clothing = Category.objects.create(
        name="Test Clothing",
        slug="test-clothing", 
        display_order=2
    )
    
    # Create subcategories
    phones = Category.objects.create(
        name="Test Smartphones",
        slug="test-smartphones",
        parent_category=electronics,
        display_order=1
    )
    
    laptops = Category.objects.create(
        name="Test Laptops",
        slug="test-laptops",
        parent_category=electronics,
        display_order=2
    )
    
    # Create sub-subcategories
    android = Category.objects.create(
        name="Test Android Phones",
        slug="test-android-phones",
        parent_category=phones,
        display_order=1
    )
    
    iphone = Category.objects.create(
        name="Test iPhones",
        slug="test-iphones",
        parent_category=phones,
        display_order=2
    )
    
    # Create clothing subcategories
    mens = Category.objects.create(
        name="Test Men's Clothing",
        slug="test-mens-clothing",
        parent_category=clothing,
        display_order=1
    )
    
    womens = Category.objects.create(
        name="Test Women's Clothing", 
        slug="test-womens-clothing",
        parent_category=clothing,
        display_order=2
    )
    
    print(f"✅ Created {Category.objects.filter(name__startswith='Test').count()} test categories")
    return [electronics, clothing, phones, laptops, android, iphone, mens, womens]

def test_hierarchical_ordering():
    """Test the hierarchical ordering in CategoryAdmin"""
    print("\n🧪 Testing hierarchical ordering...")
    
    # Create admin instance
    admin_site = AdminSite()
    category_admin = CategoryAdmin(Category, admin_site)
    
    # Create a mock request
    factory = RequestFactory()
    request = factory.get('/admin/categories/category/')
    request.GET = {}  # No search parameters
    
    # Get the queryset with hierarchical ordering
    queryset = category_admin.get_queryset(request)
    categories = list(queryset)
    
    print(f"📋 Retrieved {len(categories)} categories in hierarchical order:")
    
    for i, category in enumerate(categories):
        level = category_admin.get_category_level(category)
        indent = "  " * level
        hierarchical_name = category_admin.get_hierarchical_name(category)
        print(f"{i+1:2d}. {indent}[L{level}] {category.name}")
        
        # Verify hierarchical constraints
        if category.parent_category:
            parent_index = next(
                (j for j, cat in enumerate(categories) if cat.id == category.parent_category.id), 
                None
            )
            if parent_index is not None and parent_index > i:
                print(f"❌ ERROR: Child {category.name} appears before parent {category.parent_category.name}")
                return False
    
    print("✅ Hierarchical ordering is correct!")
    return True

def test_hierarchical_choices():
    """Test the hierarchical choices for parent category dropdown"""
    print("\n📋 Testing hierarchical choices for dropdown...")
    
    admin_site = AdminSite()
    category_admin = CategoryAdmin(Category, admin_site)
    
    choices = category_admin.get_hierarchical_choices()
    
    print("Parent category dropdown choices:")
    for value, label in choices:
        if value == '':
            print(f"  {label}")
        else:
            category = Category.objects.get(id=value)
            level = category_admin.get_category_level(category)
            print(f"  [{value}] {label} (Level {level})")
    
    print("✅ Hierarchical dropdown choices generated successfully!")

def main():
    """Main test function"""
    print("🌳 Testing Hierarchical Category Admin Display")
    print("=" * 50)
    
    try:
        # Create test data
        categories = create_test_categories()
        
        # Test hierarchical ordering
        if not test_hierarchical_ordering():
            return
        
        # Test dropdown choices
        test_hierarchical_choices()
        
        print("\n" + "=" * 50)
        print("🎉 All tests passed! The hierarchical admin display is working correctly.")
        print(f"🌐 Visit http://127.0.0.1:8000/admin/categories/category/ to see the admin interface")
        print("💡 The categories should display with tree icons and proper indentation")
        
    except Exception as e:
        print(f"❌ Error during testing: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
