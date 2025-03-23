from django.contrib import admin
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.urls import path
from django import forms
from .models import Vendor, VendorProduct, ProductImage, ProductAttributeValue
from adminsortable2.admin import SortableInlineAdminMixin, SortableAdminBase, SortableAdminMixin
from categories.models import Attribute, AttributeGroup, AttributeOption
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

class VendorProductAdminForm(forms.ModelForm):
    class Meta:
        model = VendorProduct
        fields = '__all__'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if 'category' in self.fields:
            self.fields['category'].widget.attrs.update({'id': 'id_category_field'})

@admin.register(VendorProduct)
class VendorProductAdmin(SortableAdminBase, admin.ModelAdmin):
    form = VendorProductAdminForm
    inlines = [ProductImageInline, ProductAttributeValueInline]
    list_display = ['name', 'vendor', 'price', 'stock', 'category', 'is_hot', 'display_order']
    list_filter = ['vendor', 'category', 'is_hot']
    search_fields = ['name', 'sku', 'description']
    readonly_fields = ['created_at']
    list_editable = ['display_order']
    
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
        js = ('js/vendor_product_admin.js',)
    
    def get_form(self, request, obj=None, **kwargs):
        request._obj_ = obj
        return super().get_form(request, obj, **kwargs)
    
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
    readonly_fields = ['created_at']
    
    fieldsets = (
        (None, {
            'fields': ('user', 'store_name')
        }),
        ('Store Information', {
            'fields': ('description', 'contact_email', 'phone', 'address', 'logo')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
