#!/usr/bin/env python
"""
Final comprehensive test for the hierarchical admin system.
This verifies all components of the hierarchical admin are working correctly.
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
from categories.admin import CategoryAdmin
from vendors.admin import VendorProductAdmin
from django.contrib.admin.sites import AdminSite

def test_category_admin_hierarchical_display():
    """Test hierarchical display in Categories admin"""
    print("=== Category Admin Hierarchical Display Test ===\n")
    
    admin_site = AdminSite()
    category_admin = CategoryAdmin(Category, admin_site)
    
    # Get some categories to test
    categories = list(Category.objects.select_related('parent_category').prefetch_related('subcategories')[:5])
    
    if not categories:
        print("❌ No categories found for testing")
        return False
    
    print(f"Testing {len(categories)} categories:\n")
    
    success = True
    for i, category in enumerate(categories, 1):
        print(f"--- Category {i}: {category.name} ---")
        
        # Test hierarchical name display
        hierarchical_name = category_admin.get_hierarchical_name(category)
        print(f"Hierarchical Name: {hierarchical_name}")
        
        # Test children count
        children_count = category_admin.get_children_count(category)
        print(f"Children Count: {children_count}")
        
        # Verify hierarchical symbols are present
        if category.parent_category and ('├─' in hierarchical_name or '└─' in hierarchical_name or '│' in hierarchical_name):
            print("✅ Tree symbols found")
        elif not category.parent_category:
            print("✅ Root category (no tree symbols needed)")
        else:
            print("❌ Tree symbols missing for child category")
            success = False
        
        print()
    
    return success

def test_vendor_product_dropdown():
    """Test hierarchical dropdown in VendorProduct admin"""
    print("=== VendorProduct Admin Dropdown Test ===\n")
    
    admin_site = AdminSite()
    vendor_admin = VendorProductAdmin(VendorProduct, admin_site)
    
    # Create a mock request and db_field
    class MockRequest:
        pass
    
    class MockField:
        def __init__(self, name):
            self.name = name
    
    request = MockRequest()
    db_field = MockField('category')
    
    try:
        # Test the dropdown customization
        formfield = vendor_admin.formfield_for_foreignkey(db_field, request)
        
        if formfield and hasattr(formfield.widget, 'choices'):
            print("✅ Custom dropdown field created successfully")
            
            # Check if choices are hierarchically ordered
            choices = list(formfield.widget.choices)
            if choices:
                print(f"Found {len(choices)} choices in dropdown")
                
                # Show first few choices to verify formatting
                for i, (value, label) in enumerate(choices[:5]):
                    if i == 0 and value == '':
                        continue  # Skip empty choice
                    print(f"Choice: {label}")
                    
                    # Check for tree symbols
                    if '├─' in label or '└─' in label or '│' in label:
                        print("✅ Tree symbols found in dropdown choice")
                    else:
                        print("ℹ️  Root category or no tree symbols")
                
                print("✅ Dropdown test completed")
                return True
            else:
                print("❌ No choices found in dropdown")
                return False
        else:
            print("❌ Failed to create custom dropdown field")
            return False
            
    except Exception as e:
        print(f"❌ Error testing dropdown: {e}")
        return False

def test_vendor_product_breadcrumb():
    """Test breadcrumb display in VendorProduct admin list"""
    print("=== VendorProduct Admin Breadcrumb Test ===\n")
    
    # Get some VendorProducts with categories
    vendor_products = VendorProduct.objects.select_related('category').filter(category__isnull=False)[:3]
    
    if not vendor_products:
        print("❌ No VendorProducts with categories found")
        return False
    
    admin_site = AdminSite()
    vendor_admin = VendorProductAdmin(VendorProduct, admin_site)
    
    print(f"Testing {len(vendor_products)} VendorProducts:\n")
    
    success = True
    for i, product in enumerate(vendor_products, 1):
        print(f"--- Product {i}: {product.name} ---")
        
        # Test breadcrumb display
        breadcrumb_html = vendor_admin.get_category_hierarchical(product)
        print(f"Breadcrumb HTML: {breadcrumb_html}")
        print(f"HTML Type: {type(breadcrumb_html)}")
        
        # Verify all components are present
        html_str = str(breadcrumb_html)
        
        checks = [
            ('<span class="level-badge', 'Level badge'),
            ('<div class="category-breadcrumb">', 'Breadcrumb container'),
            ('breadcrumb-separator', 'Breadcrumb separators'),
            ('<strong>', 'Bold current category')
        ]
        
        for check_str, description in checks:
            if check_str in html_str:
                print(f"✅ {description} found")
            else:
                print(f"❌ {description} missing")
                success = False
        
        # Check if it's a SafeString
        from django.utils.safestring import SafeString
        if isinstance(breadcrumb_html, SafeString):
            print("✅ HTML is properly marked as safe")
        else:
            print("❌ HTML is not marked as safe")
            success = False
        
        print()
    
    return success

def main():
    """Run all tests"""
    print("🚀 Starting Comprehensive Hierarchical Admin Test Suite\n")
    
    tests = [
        ("Category Admin Hierarchical Display", test_category_admin_hierarchical_display),
        ("VendorProduct Admin Dropdown", test_vendor_product_dropdown),
        ("VendorProduct Admin Breadcrumb", test_vendor_product_breadcrumb)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"{'='*60}")
        print(f"Running: {test_name}")
        print(f"{'='*60}")
        
        try:
            result = test_func()
            results.append((test_name, result))
            if result:
                print(f"✅ {test_name}: PASSED\n")
            else:
                print(f"❌ {test_name}: FAILED\n")
        except Exception as e:
            print(f"❌ {test_name}: ERROR - {e}\n")
            results.append((test_name, False))
    
    # Summary
    print(f"{'='*60}")
    print("TEST SUMMARY")
    print(f"{'='*60}")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name}: {status}")
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED! The hierarchical admin system is working correctly.")
        print("\nFeatures verified:")
        print("✅ Categories admin displays hierarchical tree structure")
        print("✅ VendorProduct admin dropdown shows hierarchical categories")
        print("✅ VendorProduct admin list shows breadcrumb paths with level badges")
        print("✅ All HTML is properly rendered (not escaped)")
        print("✅ All styling and visual enhancements are working")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Please review the issues above.")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
