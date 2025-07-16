#!/usr/bin/env python
"""
Test script to verify hierarchical admin functionality
"""
import os
import sys
import django

# Add the backend directory to Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_multivendor.settings')
django.setup()

from categories.models import Category
from vendors.models import VendorProduct

def test_hierarchical_display():
    """Test the hierarchical display functionality"""
    print("🌳 Testing Hierarchical Category Display")
    print("=" * 50)
    
    # Get some sample categories
    categories = Category.objects.all()[:10]
    
    for category in categories:
        # Test the hierarchical path
        breadcrumb = category.get_breadcrumb_path()
        path = " > ".join([cat.name for cat in breadcrumb])
        
        # Test level calculation
        level = 0
        current = category.parent_category
        while current:
            level += 1
            current = current.parent_category
        
        # Test product count
        product_count = category.product_count
        
        print(f"📁 {category.name}")
        print(f"   Path: {path}")
        print(f"   Level: {level}")
        print(f"   Products: {product_count}")
        print(f"   Descendants: {len(category.get_descendants_and_self()) - 1}")
        print()

def test_category_choices():
    """Test the hierarchical category choices generation"""
    print("🔽 Testing Category Dropdown Choices")
    print("=" * 50)
    
    choices = [('', '--- Select Category ---')]
    
    def add_category_choices(categories, level=0):
        for category in categories:
            if level == 0:
                prefix = "📁 "
            elif level == 1:
                prefix = "├── "
            elif level == 2:
                prefix = "│   ├── "
            else:
                prefix = "│   " * (level - 1) + "├── "
            
            product_count = category.product_count
            count_info = f" ({product_count} products)" if product_count > 0 else " (0 products)"
            display_name = f"{prefix}{category.name}{count_info}"
            choices.append((category.id, display_name))
            
            children = Category.objects.filter(parent_category=category).order_by('display_order', 'name')
            if children:
                add_category_choices(children, level + 1)
    
    root_categories = Category.objects.filter(parent_category=None).order_by('display_order', 'name')[:5]
    add_category_choices(root_categories)
    
    for choice_id, choice_name in choices[:20]:  # Show first 20 choices
        print(f"Value: {choice_id:3} | Display: {choice_name}")

def test_vendor_products():
    """Test VendorProduct category display"""
    print("🛍️ Testing VendorProduct Category Display")
    print("=" * 50)
    
    products = VendorProduct.objects.select_related('category').all()[:5]
    
    for product in products:
        print(f"📦 {product.name}")
        if product.category:
            breadcrumb = product.category.get_breadcrumb_path()
            path = " › ".join([cat.name for cat in breadcrumb])
            level = len(breadcrumb) - 1
            print(f"   Category Path: {path}")
            print(f"   Level: L{level}")
        else:
            print("   Category: No Category")
        print()

if __name__ == "__main__":
    print("🚀 Starting Hierarchical Admin Tests")
    print("=" * 60)
    print()
    
    try:
        test_hierarchical_display()
        test_category_choices()
        test_vendor_products()
        
        print("✅ All tests completed successfully!")
        print("\n📋 Summary:")
        print(f"   Total Categories: {Category.objects.count()}")
        print(f"   Root Categories: {Category.objects.filter(parent_category=None).count()}")
        print(f"   Total Products: {VendorProduct.objects.count()}")
        print(f"   Products with Categories: {VendorProduct.objects.filter(category__isnull=False).count()}")
        
    except Exception as e:
        print(f"❌ Error during testing: {e}")
        import traceback
        traceback.print_exc()
