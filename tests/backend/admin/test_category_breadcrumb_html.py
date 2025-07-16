#!/usr/bin/env python
"""
Test script to verify that the VendorProduct admin's category breadcrumb
renders HTML correctly instead of showing escaped text.
"""

import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_multivendor.settings')
django.setup()

from django.utils.html import format_html
from django.utils.safestring import mark_safe
from vendors.admin import VendorProductAdmin
from vendors.models import VendorProduct
from categories.models import Category

def test_category_breadcrumb_html():
    """Test that the category breadcrumb method returns proper HTML"""
    print("Testing VendorProduct category breadcrumb HTML rendering...")
    print("=" * 60)
    
    # Create admin instance
    admin_instance = VendorProductAdmin(VendorProduct, None)
    
    # Get a VendorProduct with a category that has a hierarchical path
    try:
        vendor_product = VendorProduct.objects.select_related('category').first()
        if not vendor_product:
            print("❌ No VendorProduct found in database")
            return
        
        if not vendor_product.category:
            print("❌ VendorProduct has no category assigned")
            return
        
        print(f"Testing VendorProduct: {vendor_product.name}")
        print(f"Category: {vendor_product.category.name}")
        
        # Get the breadcrumb path
        breadcrumb = vendor_product.category.get_breadcrumb_path()
        print(f"Breadcrumb path: {[cat.name for cat in breadcrumb]}")
        
        # Test the admin method
        result = admin_instance.get_category_hierarchical(vendor_product)
        
        print(f"\nHTML Result:")
        print(f"Type: {type(result)}")
        print(f"Content: {result}")
        
        # Check if it's a SafeString (which allows HTML rendering)
        from django.utils.safestring import SafeString
        is_safe = isinstance(result, SafeString)
        print(f"Is SafeString (HTML will render): {is_safe}")
        
        if is_safe:
            print("✅ HTML breadcrumb should render correctly in admin")
        else:
            print("❌ HTML breadcrumb will be escaped in admin")
        
        # Test with different category levels
        categories = Category.objects.all()[:5]
        print(f"\nTesting with {len(categories)} categories:")
        
        for cat in categories:
            print(f"\nCategory: {cat.name}")
            breadcrumb = cat.get_breadcrumb_path()
            level = len(breadcrumb) - 1
            print(f"Breadcrumb: {[c.name for c in breadcrumb]} (Level: {level})")
            
            # Create mock object
            class MockProduct:
                def __init__(self, category):
                    self.category = category
            
            mock_product = MockProduct(cat)
            result = admin_instance.get_category_hierarchical(mock_product)
            
            is_safe = isinstance(result, SafeString)
            print(f"HTML Safe: {is_safe}")
            print(f"Result: {result}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

def test_html_components():
    """Test individual HTML components"""
    print("\nTesting HTML components:")
    print("=" * 30)
    
    # Test format_html vs mark_safe
    test_html = '<strong>Electronics</strong>'
    
    # Using format_html
    result1 = format_html('<div>{}</div>', test_html)
    print(f"format_html with HTML string: {result1}")
    print(f"Type: {type(result1)}")
    
    # Using format_html with mark_safe
    result2 = format_html('<div>{}</div>', mark_safe(test_html))
    print(f"format_html with mark_safe: {result2}")
    print(f"Type: {type(result2)}")
    
    # Test breadcrumb separator
    separator = ' <span class="breadcrumb-separator">›</span> '
    parts = ['Electronics', '<strong>Computers</strong>', '<strong>Laptops</strong>']
    breadcrumb_html = separator.join(parts)
    
    result3 = format_html('<div>{}</div>', mark_safe(breadcrumb_html))
    print(f"Breadcrumb with mark_safe: {result3}")

if __name__ == "__main__":
    test_category_breadcrumb_html()
    test_html_components()
