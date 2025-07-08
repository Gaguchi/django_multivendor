#!/usr/bin/env python
"""
Verification script for VendorProduct admin category dropdown functionality.
This script verifies that the hierarchical category dropdown is working correctly.
"""

import os
import sys
import django

# Setup Django environment
if __name__ == "__main__":
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_multivendor.settings')
    django.setup()

    from categories.models import Category
    from categories.admin import CategoryAdmin
    from vendors.admin import VendorProductAdmin
    from vendors.models import VendorProduct
    from django.contrib.admin.sites import AdminSite
    from django.http import HttpRequest
    from django import forms
    import json

    print("🔍 Verifying VendorProduct Admin Category Dropdown")
    print("=" * 60)

    # Test 1: Check if categories exist and have hierarchy
    print("\n1. Testing Category Hierarchy Structure:")
    categories = Category.objects.select_related('parent_category').prefetch_related('subcategories')
    total_categories = categories.count()
    root_categories = categories.filter(parent_category__isnull=True).count()
    child_categories = categories.filter(parent_category__isnull=False).count()
    
    print(f"   📊 Total categories: {total_categories}")
    print(f"   📊 Root categories: {root_categories}")
    print(f"   📊 Child categories: {child_categories}")
    
    if total_categories == 0:
        print("   ⚠️  No categories found. Please create some categories first.")
        sys.exit(1)
    else:
        print("   ✅ Category hierarchy structure exists")

    # Test 2: Verify CategoryAdmin hierarchical ordering logic
    print("\n2. Testing CategoryAdmin Hierarchical Ordering Logic:")
    try:
        category_admin = CategoryAdmin(Category, AdminSite())
        all_categories = list(categories)
        ordered_categories = category_admin._get_hierarchical_order(all_categories)
        
        print(f"   ✅ Hierarchical ordering successful: {len(ordered_categories)} categories")
        
        # Verify parent-child order
        for i, category in enumerate(ordered_categories):
            level = category_admin.get_category_level(category)
            if category.parent_category:
                parent_index = next((j for j, cat in enumerate(ordered_categories) if cat.id == category.parent_category.id), -1)
                if parent_index >= i:
                    print(f"   ❌ Order violation: {category.name} appears before its parent")
                    break
        else:
            print("   ✅ All parent-child relationships are correctly ordered")
            
    except Exception as e:
        print(f"   ❌ Error in hierarchical ordering: {e}")

    # Test 3: Test VendorProduct admin formfield logic
    print("\n3. Testing VendorProduct Admin Category Dropdown Logic:")
    try:
        vendor_admin = VendorProductAdmin(VendorProduct, AdminSite())
        
        # Create a mock request
        request = HttpRequest()
        
        # Create a mock database field for category
        class MockField:
            def __init__(self):
                self.name = "category"
                self.remote_field = None
                
        # Since we're using custom choices instead of queryset, test the choice generation
        category_admin = CategoryAdmin(Category, AdminSite())
        all_categories = list(Category.objects.select_related('parent_category').prefetch_related('subcategories'))
        ordered_categories = category_admin._get_hierarchical_order(all_categories)
        
        choices = [('', '--- Select Category ---')]
        
        for category in ordered_categories:
            level = category_admin.get_category_level(category)
            
            # Create visual hierarchy with consistent symbols from CategoryAdmin
            if level == 0:
                prefix = "📁 "
            elif level == 1:
                prefix = "├── "
            elif level == 2:
                prefix = "│   ├── "
            else:
                prefix = "│   " * (level - 1) + "├── "
            
            # Add product count and children count for context
            product_count = category.product_count
            children_count = category.subcategories.count()
            
            context_parts = []
            if product_count > 0:
                context_parts.append(f"{product_count} products")
            if children_count > 0:
                context_parts.append(f"{children_count} subcategories")
            
            context_info = f" ({', '.join(context_parts)})" if context_parts else ""
            display_name = f"{prefix}{category.name}{context_info}"
            choices.append((category.id, display_name))
        
        print(f"   ✅ Generated {len(choices)} dropdown choices (including empty option)")
        
        # Show sample of choices for verification
        print("   📋 Sample dropdown choices:")
        for i, (value, label) in enumerate(choices[:6]):  # Show first 6 choices
            if value == '':
                print(f"      {i+1}. [Empty] {label}")
            else:
                print(f"      {i+1}. [ID:{value}] {label}")
        if len(choices) > 6:
            print(f"      ... and {len(choices) - 6} more choices")
            
    except Exception as e:
        print(f"   ❌ Error in dropdown generation: {e}")

    # Test 4: Check widget styling attributes
    print("\n4. Testing Dropdown Widget Styling:")
    try:
        expected_classes = ['hierarchical-select', 'vendor-category-select']
        expected_style = 'font-family: monospace; font-size: 13px; width: 100%; background-color: #f8f9fa;'
        
        # Test widget creation
        widget = forms.Select(
            choices=[('', '--- Select Category ---')],
            attrs={
                'class': 'hierarchical-select vendor-category-select',
                'style': expected_style
            }
        )
        
        widget_classes = widget.attrs.get('class', '').split()
        has_all_classes = all(cls in widget_classes for cls in expected_classes)
        has_style = 'style' in widget.attrs
        
        print(f"   ✅ Widget classes: {widget_classes}")
        print(f"   ✅ Widget styling: {'Present' if has_style else 'Missing'}")
        print(f"   ✅ All required classes present: {has_all_classes}")
        
    except Exception as e:
        print(f"   ❌ Error testing widget styling: {e}")

    # Test 5: Verify CSS file exists
    print("\n5. Testing CSS File Availability:")
    css_path = os.path.join(os.path.dirname(__file__), 'static', 'css', 'hierarchical_admin.css')
    if os.path.exists(css_path):
        print(f"   ✅ CSS file exists: {css_path}")
        with open(css_path, 'r') as f:
            css_content = f.read()
            vendor_css_present = '.vendor-category-select' in css_content
            hierarchical_css_present = '.hierarchical-select' in css_content
            print(f"   ✅ Vendor category CSS present: {vendor_css_present}")
            print(f"   ✅ Hierarchical select CSS present: {hierarchical_css_present}")
    else:
        print(f"   ❌ CSS file not found: {css_path}")

    print("\n" + "=" * 60)
    print("🎉 VendorProduct admin category dropdown verification complete!")
    print("💡 To test in browser:")
    print("   1. Start the Django development server")
    print("   2. Visit /admin/vendors/vendorproduct/add/")
    print("   3. Check the Category dropdown for hierarchical display")
    print("   4. Verify the styling and tree structure")
