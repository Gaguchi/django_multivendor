#!/usr/bin/env python
"""
Test script to verify the VendorProduct category dropdown shows hierarchical structure.
"""

import os
import sys
import django

# Add the backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_multivendor.settings')
django.setup()

from django.contrib.admin.sites import AdminSite
from categories.models import Category
from vendors.admin import VendorProductAdmin
from vendors.models import VendorProduct
from django.test import RequestFactory

def test_hierarchical_dropdown():
    """Test the hierarchical dropdown choices generation"""
    print("🔍 Testing VendorProduct Category Dropdown Hierarchical Structure")
    print("=" * 70)
    
    # Create a fake request
    factory = RequestFactory()
    request = factory.get('/admin/vendors/vendorproduct/add/')
    
    # Create admin instance
    admin_site = AdminSite()
    vendor_admin = VendorProductAdmin(VendorProduct, admin_site)
    
    # Get the category field
    from django.db import models
    category_field = VendorProduct._meta.get_field('category')
    
    # Get the form field with hierarchical choices
    print("🔧 Generating hierarchical form field...")
    form_field = vendor_admin.formfield_for_foreignkey(category_field, request)
    
    print(f"✅ Form field type: {type(form_field)}")
    print(f"✅ Widget type: {type(form_field.widget)}")
    print(f"✅ Widget class: {form_field.widget.attrs.get('class', 'No class')}")
    
    # Check the choices
    choices = list(form_field.choices)
    print(f"\n📋 Total choices: {len(choices)}")
    print("=" * 50)
    
    for i, (value, label) in enumerate(choices):
        # Show indentation structure
        indent_level = 0
        if label.startswith('    '):
            # Count leading spaces to determine level
            indent_level = (len(label) - len(label.lstrip(' '))) // 4
        
        level_indicator = f"[L{indent_level}]" if indent_level > 0 else "[ROOT]"
        status = "✅" if value else "ℹ️"
        
        print(f"{status} {level_indicator:6} {label}")
        
        # Show only first 10 for readability
        if i >= 15:
            print(f"... and {len(choices) - i - 1} more choices")
            break
    
    print("\n" + "=" * 70)
    
    # Test with actual categories
    print("🏗️ Testing with actual category hierarchy...")
    
    categories = Category.objects.select_related('parent_category').all()
    if categories.exists():
        print(f"Found {categories.count()} categories in database")
        
        # Show first few categories and their hierarchy
        for cat in categories[:5]:
            level = 0
            parent = cat.parent_category
            while parent:
                level += 1
                parent = parent.parent_category
            
            print(f"   {cat.name} (Level {level}, ID: {cat.id})")
    else:
        print("❌ No categories found in database!")
    
    print("\n🔍 Checking form field choices structure...")
    
    # Analyze the choice structure
    hierarchical_found = False
    for value, label in choices[1:6]:  # Skip empty choice
        if '    ' in label and ('├─' in label or '└─' in label or '□' in label):
            hierarchical_found = True
            print(f"✅ Found hierarchical formatting: '{label}'")
            break
    
    if hierarchical_found:
        print("\n🎉 SUCCESS: Hierarchical dropdown structure is working!")
    else:
        print("\n❌ ISSUE: No hierarchical formatting found in dropdown choices")
    
    print("\n📝 Next steps:")
    print("1. Open Django admin in browser")
    print("2. Go to VendorProduct add/edit page")
    print("3. Check the Category dropdown")
    print("4. Verify indentation and tree symbols are visible")

if __name__ == "__main__":
    test_hierarchical_dropdown()
