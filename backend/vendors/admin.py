from django.contrib import admin
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.urls import path
from django import forms
from django.utils.html import format_html
from .models import Vendor, VendorProduct, ProductImage, ProductAttributeValue
from adminsortable2.admin import SortableInlineAdminMixin, SortableAdminBase, SortableAdminMixin
from categories.models import Attribute, AttributeGroup, AttributeOption, Category
from django.db.models import Prefetch
from django.contrib import messages

class ProductImageInline(SortableInlineAdminMixin, admin.TabularInline):
    model = ProductImage
    extra = 1
    max_num = 10
    fields = ['file', 'alt_text', 'position']
    ordering = ['position']

class AttributeValueForm(forms.ModelForm):
    class Meta:
        model = ProductAttributeValue
        fields = ['attribute', 'text_value', 'number_value', 'boolean_value', 'option_values']
        widgets = {
            'text_value': forms.TextInput(attrs={'class': 'attribute-value-field'}),
            'number_value': forms.NumberInput(attrs={'class': 'attribute-value-field'}),
            'boolean_value': forms.CheckboxInput(attrs={'class': 'attribute-value-field'}),
            'option_values': forms.SelectMultiple(attrs={'class': 'attribute-value-field'}),
        }

class ProductAttributeValueInline(admin.TabularInline):
    model = ProductAttributeValue
    form = AttributeValueForm
    extra = 0  
    fields = ['attribute', 'text_value', 'number_value', 'boolean_value', 'option_values']
    filter_horizontal = ['option_values']
    classes = ['product-attributes-inline']
    
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related('attribute', 'attribute__group')
    
    def formfield_for_foreignkey(self, db_field, request=None, **kwargs):
        if (db_field.name == 'attribute'):
            if hasattr(request, '_obj_') and request._obj_ and request._obj_.category:
                kwargs['queryset'] = Attribute.objects.filter(
                    group__categories=request._obj_.category
                ).distinct().order_by('group__name', 'name')
            else:
                kwargs['queryset'] = Attribute.objects.all().order_by('group__name', 'name')
                
            # Add data attributes for attribute group and type
            kwargs['widget'] = forms.Select(attrs={'class': 'attribute-select'})
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

class ProductComboInline(admin.TabularInline):
    model = VendorProduct.frequently_bought_together.through
    fk_name = 'from_vendorproduct'
    verbose_name = "Frequently Bought Together Product"
    verbose_name_plural = "Frequently Bought Together Products"
    extra = 1
    
    def formfield_for_foreignkey(self, db_field, request=None, **kwargs):
        if db_field.name == 'to_vendorproduct':
            if hasattr(request, '_obj_') and request._obj_:
                # Only show products from the same vendor
                kwargs['queryset'] = VendorProduct.objects.filter(
                    vendor=request._obj_.vendor
                ).exclude(id=request._obj_.id)
            else:
                kwargs['queryset'] = VendorProduct.objects.none()
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

class VendorProductAdminForm(forms.ModelForm):
    class Meta:
        model = VendorProduct
        fields = '__all__'
        exclude = ('frequently_bought_together',)
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if 'category' in self.fields:
            self.fields['category'].widget.attrs.update({'id': 'id_category_field'})

@admin.register(VendorProduct)
class VendorProductAdmin(SortableAdminBase, admin.ModelAdmin):
    form = VendorProductAdminForm
    inlines = [ProductImageInline, ProductAttributeValueInline, ProductComboInline]
    list_display = ['name', 'vendor', 'price', 'stock', 'get_category_hierarchical', 'is_hot', 'display_order', 'has_combos']
    list_filter = ['vendor', 'category', 'is_hot']
    search_fields = ['name', 'sku', 'description']
    readonly_fields = ['created_at']
    list_editable = ['display_order']
    filter_horizontal = ['frequently_bought_together']
    
    fieldsets = (
        (None, {
            'fields': ('vendor', 'category', 'name', 'sku', 'display_order')
        }),
        ('Pricing & Inventory', {
            'fields': ('price', 'old_price', 'stock', 'is_hot')
        }),
        ('Product Details', {
            'fields': ('description', 'thumbnail', 'secondaryImage', 'video', 'rating', 'created_at')
        }),
    )
    
    class Media:
        js = ('js/vendor_product_admin.js', 'js/product_combo_admin.js')
        css = {
            'all': ('css/hierarchical_admin.css',)
        }
    
    def get_category_hierarchical(self, obj):
        """Display category with hierarchical path and visual enhancements"""
        if obj.category:
            breadcrumb = obj.category.get_breadcrumb_path()
            path_parts = []
            for i, cat in enumerate(breadcrumb):
                if i == len(breadcrumb) - 1:  # Last category (current)
                    path_parts.append(f'<strong>{cat.name}</strong>')
                else:
                    path_parts.append(cat.name)
            
            # Create a styled breadcrumb path
            breadcrumb_html = ' <span class="breadcrumb-separator">›</span> '.join(path_parts)
            
            # Add level indicator
            level = len(breadcrumb) - 1
            level_badge = f'<span class="level-badge level-{level}">L{level}</span>'
            
            return format_html(
                '{} <div class="category-breadcrumb">{}</div>',
                level_badge,
                breadcrumb_html
            )
        return format_html('<span class="no-category">No Category</span>')
    get_category_hierarchical.short_description = 'Category Path'
    get_category_hierarchical.admin_order_field = 'category__name'
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        """Customize the category dropdown to show hierarchical names with proper indentation"""
        if db_field.name == "category":
            # Use the same hierarchical ordering logic as CategoryAdmin
            from categories.admin import CategoryAdmin
            from django.contrib.admin.sites import AdminSite
            
            # Create a temporary CategoryAdmin instance to use its methods
            temp_category_admin = CategoryAdmin(Category, AdminSite())
            
            # Get all categories in hierarchical order
            all_categories = list(Category.objects.select_related('parent_category').prefetch_related('subcategories'))
            ordered_categories = temp_category_admin._get_hierarchical_order(all_categories)
            
            # Set the queryset to maintain the hierarchical order
            # We'll create the queryset with preserved order
            if ordered_categories:
                from django.db.models import Case, When
                ordered_ids = [cat.id for cat in ordered_categories]
                preserved = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(ordered_ids)])
                kwargs['queryset'] = Category.objects.filter(id__in=ordered_ids).annotate(ordering=preserved).order_by('ordering')
            else:
                kwargs['queryset'] = Category.objects.none()
            
            # Create a custom widget that will render hierarchical display names
            widget_attrs = {
                'class': 'hierarchical-select vendor-category-select',
                'data-hierarchical': 'true'
            }
            
            # Create custom choices with proper text-based indentation that works in option tags
            field = super().formfield_for_foreignkey(db_field, request, **kwargs)
            
            # Modify the field to use hierarchical display
            original_choices = list(field.choices)
            hierarchical_choices = [('', '--- Select Category ---')]
            
            for category in ordered_categories:
                level = temp_category_admin.get_category_level(category)
                
                # Use simple indentation that works in HTML option tags
                indent = "    " * level  # 4 spaces per level
                
                # Use simple ASCII characters that display properly in dropdowns
                if level == 0:
                    prefix = "□ "  # Simple box for root
                elif level == 1:
                    prefix = "├─ "  # Simple branch
                else:
                    prefix = "└─ "  # Simple end branch for deeper levels
                
                # Add product count for context
                product_count = getattr(category, 'product_count', 0)
                context_info = f" ({product_count})" if product_count > 0 else ""
                
                display_name = f"{indent}{prefix}{category.name}{context_info}"
                hierarchical_choices.append((category.id, display_name))
            
            # Apply the custom choices to the field
            field.choices = hierarchical_choices
            field.widget.attrs.update(widget_attrs)
            
            return field
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
    
    def get_form(self, request, obj=None, **kwargs):
        request._obj_ = obj
        return super().get_form(request, obj, **kwargs)
    
    def has_combos(self, obj):
        """Return True if this product has frequently bought together products"""
        return obj.frequently_bought_together.exists()
    has_combos.boolean = True
    has_combos.short_description = 'Has Combos'
    
    def add_view(self, request, form_url='', extra_context=None):
        extra_context = extra_context or {}
        extra_context['show_save_and_add_attributes'] = True
        return super().add_view(request, form_url, extra_context=extra_context)
    
    def change_view(self, request, object_id, form_url='', extra_context=None):
        # Get the object
        obj = self.get_object(request, object_id)
        extra_context = extra_context or {}
        
        if obj and obj.category:
            # Check if the product already has all possible attributes
            category_attributes = Attribute.objects.filter(
                group__categories=obj.category
            ).count()
            
            existing_attributes = ProductAttributeValue.objects.filter(
                product=obj
            ).count()
            
            if category_attributes > existing_attributes:
                extra_context['show_update_attributes'] = True
            
        return super().change_view(request, object_id, form_url, extra_context=extra_context)
    
    def response_add(self, request, obj, post_url_continue=None):
        if "_addattributes" in request.POST:
            self._create_attribute_values_for_product(obj)
            self.message_user(request, f"Attribute fields for {obj.name} have been added.")
            return self.response_post_save_add(request, obj)
        return super().response_add(request, obj, post_url_continue)
    
    def response_change(self, request, obj):
        if "_addattributes" in request.POST:
            self._create_attribute_values_for_product(obj)
            self.message_user(request, f"Attribute fields for {obj.name} have been updated.")
        return super().response_change(request, obj)
    
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        # Auto-create attributes for new products if category set
        if not change and obj.category:
            self._create_attribute_values_for_product(obj)
            if ProductAttributeValue.objects.filter(product=obj).exists():
                messages.info(request, f"Default attribute fields created for {obj.name}.")
    
    def _create_attribute_values_for_product(self, product):
        """Create attribute value entries for all attributes in the product's category"""
        if not product.category:
            return
            
        # Get all attributes for this category
        attributes = Attribute.objects.filter(
            group__categories=product.category
        ).select_related('group').order_by('group__display_order', 'display_order')
        
        # Get existing attribute values for this product
        existing_attrs = set(ProductAttributeValue.objects.filter(
            product=product
        ).values_list('attribute_id', flat=True))
        
        # Create attribute values for missing attributes
        for attr in attributes:
            if attr.id not in existing_attrs:
                attr_value = ProductAttributeValue(
                    product=product,
                    attribute=attr
                )
                
                # Set default values based on attribute type
                if attr.attribute_type == 'text':
                    attr_value.text_value = ''
                elif attr.attribute_type == 'number':
                    attr_value.number_value = None
                elif attr.attribute_type == 'boolean':
                    attr_value.boolean_value = False
                    
                attr_value.save()

@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = ['store_name', 'user', 'created_at']
    search_fields = ['store_name', 'user__username', 'user__email']
    date_hierarchy = 'created_at'
    readonly_fields = ['created_at', 'updated_at']  # Add updated_at as read-only
    
    fieldsets = (
        (None, {
            'fields': ('user', 'store_name')
        }),
        ('Store Information', {
            'fields': ('description', 'contact_email', 'phone', 'address', 'logo')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),  # Keep this since we made it readonly
            'classes': ('collapse',)
        }),
    )
