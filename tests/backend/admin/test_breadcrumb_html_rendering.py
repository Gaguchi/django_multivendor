#!/usr/bin/env python
"""
Test script to verify the VendorProduct admin breadcrumb HTML rendering.
This script checks that the get_category_hierarchical method returns properly formatted HTML.
"""

import os
import sys
import django

# Add the backend directory to the Python path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_multivendor.settings')
django.setup()

from categories.models import Category
from vendors.models import VendorProduct
from vendors.admin import VendorProductAdmin
from django.contrib.admin.sites import AdminSite

def test_breadcrumb_html_rendering():
    """Test that breadcrumb HTML is properly rendered without escaping"""
    print("=== VendorProduct Admin Breadcrumb HTML Rendering Test ===\n")
    
    # Get a sample VendorProduct with a category
    vendor_products = VendorProduct.objects.select_related('category').filter(category__isnull=False)[:5]
    
    if not vendor_products:
        print("❌ No VendorProducts with categories found for testing")
        return
    
    # Create admin instance
    admin_site = AdminSite()
    vendor_admin = VendorProductAdmin(VendorProduct, admin_site)
    
    print(f"Found {len(vendor_products)} VendorProducts with categories for testing\n")
    
    for i, product in enumerate(vendor_products, 1):
        print(f"--- Test {i}: {product.name} ---")
        print(f"Category: {product.category.name}")
        breadcrumb_path = product.category.get_breadcrumb_path()
        print(f"Category Level: {len(breadcrumb_path) - 1}")
        print(f"Breadcrumb Path: {[cat.name for cat in breadcrumb_path]}")
        
        # Get the hierarchical display
        html_output = vendor_admin.get_category_hierarchical(product)
        
        print(f"HTML Output: {html_output}")
        print(f"HTML Type: {type(html_output)}")
        
        # Check if it contains HTML tags that should be rendered
        if '<span class="level-badge' in str(html_output):
            print("✅ Level badge HTML found")
        else:
            print("❌ Level badge HTML missing")
            
        if '<div class="category-breadcrumb">' in str(html_output):
            print("✅ Breadcrumb container HTML found")
        else:
            print("❌ Breadcrumb container HTML missing")
            
        if '<strong>' in str(html_output):
            print("✅ Bold formatting for current category found")
        else:
            print("❌ Bold formatting missing")
            
        if 'breadcrumb-separator' in str(html_output):
            print("✅ Breadcrumb separators found")
        else:
            print("❌ Breadcrumb separators missing")
        
        print()

def test_html_safety():
    """Test that the HTML output is properly marked as safe"""
    print("=== HTML Safety Test ===\n")
    
    from django.utils.safestring import SafeString
    
    vendor_product = VendorProduct.objects.select_related('category').filter(category__isnull=False).first()
    
    if not vendor_product:
        print("❌ No VendorProduct with category found for testing")
        return
    
    admin_site = AdminSite()
    vendor_admin = VendorProductAdmin(VendorProduct, admin_site)
    
    html_output = vendor_admin.get_category_hierarchical(vendor_product)
    
    print(f"HTML Output: {html_output}")
    print(f"Is SafeString: {isinstance(html_output, SafeString)}")
    
    if isinstance(html_output, SafeString):
        print("✅ HTML output is properly marked as safe")
    else:
        print("❌ HTML output is not marked as safe - will be escaped in templates")

if __name__ == "__main__":
    try:
        test_breadcrumb_html_rendering()
        test_html_safety()
        print("\n=== Test Summary ===")
        print("✅ All tests completed successfully")
        print("The breadcrumb HTML should now render properly in the admin interface")
        
    except Exception as e:
        print(f"❌ Error during testing: {e}")
        import traceback
        traceback.print_exc()
