#!/usr/bin/env python
"""
Test script to verify hierarchical category dropdown in VendorProduct admin.
This script tests the formfield_for_foreignkey method and choice generation.
"""

import os
import sys
import django

# Add the Django project to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_multivendor.settings')
django.setup()

from vendors.admin import VendorProductAdmin
from vendors.models import VendorProduct
from categories.models import Category
from django.contrib.admin.sites import AdminSite
from django.test import RequestFactory
from django import forms

def test_vendor_category_dropdown():
    """Test the hierarchical category dropdown in VendorProduct admin"""
    print("🧪 Testing VendorProduct Admin Hierarchical Category Dropdown")
    print("=" * 65)
    
    # Create admin instance
    admin_site = AdminSite()
    vendor_admin = VendorProductAdmin(VendorProduct, admin_site)
    
    # Create a mock request
    factory = RequestFactory()
    request = factory.get('/admin/vendors/vendorproduct/add/')
    
    # Create a mock field
    class MockField:
        def __init__(self, name):
            self.name = name
    
    # Test the category field dropdown
    print("1. Testing Category Field Dropdown Generation:")
    category_field = MockField('category')
    
    try:
        # Get the formfield for category
        formfield_kwargs = {}
        formfield = vendor_admin.formfield_for_foreignkey(category_field, request, **formfield_kwargs)
        
        if hasattr(formfield, 'widget') and hasattr(formfield.widget, 'choices'):
            choices = formfield.widget.choices
            print(f"   ✅ Generated {len(choices)} category choices")
            print("   📋 Sample choices (first 10):")
            
            for i, (value, label) in enumerate(choices[:10]):
                if value == '':
                    print(f"      {i+1:2d}. [Empty] {label}")
                else:
                    # Find the category to get level info
                    try:
                        category = Category.objects.get(id=value)
                        level = 0
                        current = category.parent_category
                        while current:
                            level += 1
                            current = current.parent_category
                        print(f"      {i+1:2d}. [ID:{value:3d}] [L{level}] {label}")
                    except Category.DoesNotExist:
                        print(f"      {i+1:2d}. [ID:{value:3d}] [L?] {label}")
            
            if len(choices) > 10:
                print(f"      ... and {len(choices) - 10} more choices")
                
        else:
            print("   ❌ No widget choices found")
            
    except Exception as e:
        print(f"   ❌ Error generating category dropdown: {e}")
        import traceback
        traceback.print_exc()
    
    print()
    
    # Test hierarchical ordering consistency
    print("2. Testing Hierarchical Order Consistency:")
    try:
        # Get categories using the same method as dropdown
        from categories.admin import CategoryAdmin
        temp_category_admin = CategoryAdmin(Category, AdminSite())
        
        all_categories = list(Category.objects.select_related('parent_category').prefetch_related('subcategories'))
        ordered_categories = temp_category_admin._get_hierarchical_order(all_categories)
        
        print(f"   ✅ Hierarchical ordering successful: {len(ordered_categories)} categories")
        
        # Verify parent-child ordering
        violations = 0
        for i, category in enumerate(ordered_categories):
            if category.parent_category:
                parent_index = next(
                    (j for j, cat in enumerate(ordered_categories) if cat.id == category.parent_category.id), 
                    None
                )
                if parent_index is not None and parent_index > i:
                    violations += 1
                    print(f"   ⚠️  Child '{category.name}' appears before parent '{category.parent_category.name}'")
        
        if violations == 0:
            print("   ✅ All parent-child relationships are correctly ordered")
        else:
            print(f"   ❌ Found {violations} ordering violations")
            
    except Exception as e:
        print(f"   ❌ Error testing hierarchical order: {e}")
    
    print()
    
    # Test dropdown styling and widget attributes
    print("3. Testing Dropdown Widget Styling:")
    try:
        formfield_kwargs = {}
        formfield = vendor_admin.formfield_for_foreignkey(category_field, request, **formfield_kwargs)
        
        if hasattr(formfield, 'widget'):
            widget = formfield.widget
            print(f"   ✅ Widget type: {type(widget).__name__}")
            
            if hasattr(widget, 'attrs'):
                attrs = widget.attrs
                print("   📋 Widget attributes:")
                for key, value in attrs.items():
                    print(f"      - {key}: {value}")
                    
                # Check for expected styling
                expected_classes = ['hierarchical-select', 'vendor-category-select']
                if 'class' in attrs:
                    for cls in expected_classes:
                        if cls in attrs['class']:
                            print(f"   ✅ Found expected CSS class: {cls}")
                        else:
                            print(f"   ⚠️  Missing expected CSS class: {cls}")
            else:
                print("   ❌ No widget attributes found")
        else:
            print("   ❌ No widget found")
            
    except Exception as e:
        print(f"   ❌ Error testing widget styling: {e}")
    
    print()
    
    # Summary
    print("4. Summary:")
    category_count = Category.objects.count()
    root_count = Category.objects.filter(parent_category=None).count()
    
    print(f"   📊 Total categories: {category_count}")
    print(f"   📊 Root categories: {root_count}")
    print(f"   📊 Child categories: {category_count - root_count}")
    
    print()
    print("=" * 65)
    print("🎉 VendorProduct admin hierarchical category dropdown test complete!")
    print("💡 Visit /admin/vendors/vendorproduct/add/ to see the dropdown in action")
    
    return True

if __name__ == "__main__":
    test_vendor_category_dropdown()
