#!/usr/bin/env python
"""
Test script to verify hierarchical category filtering
"""
import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_multivendor.settings')
django.setup()

from categories.models import Category

def test_category_hierarchy():
    """Test the category hierarchy functionality"""
    print("=== Testing Category Hierarchy ===")
    
    # Get all categories
    categories = Category.objects.all()
    print(f"Total categories: {categories.count()}")
    
    # Get root categories
    root_categories = Category.objects.filter(parent_category=None)
    print(f"Root categories: {root_categories.count()}")
    
    # Test a specific category hierarchy
    if root_categories.exists():
        root_cat = root_categories.first()
        print(f"\nTesting with root category: {root_cat.name}")
        
        # Test get_descendants_and_self method
        descendants = root_cat.get_descendants_and_self()
        print(f"Descendants (including self): {descendants}")
        
        # Test product_count property
        product_count = root_cat.product_count
        print(f"Product count: {product_count}")
        
        # Test breadcrumb path
        breadcrumb = root_cat.get_breadcrumb_path()
        print(f"Breadcrumb: {[cat.name for cat in breadcrumb]}")
        
        # Test child categories
        children = Category.objects.filter(parent_category=root_cat)
        print(f"Direct children: {children.count()}")
        
        if children.exists():
            child = children.first()
            print(f"\nTesting with child category: {child.name}")
            child_descendants = child.get_descendants_and_self()
            print(f"Child descendants (including self): {child_descendants}")
            child_breadcrumb = child.get_breadcrumb_path()
            print(f"Child breadcrumb: {[cat.name for cat in child_breadcrumb]}")

if __name__ == "__main__":
    test_category_hierarchy()
