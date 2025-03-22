from django.contrib import admin
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.urls import path
from django import forms
from .models import Vendor, VendorProduct, ProductImage, ProductAttributeValue
from adminsortable2.admin import SortableInlineAdminMixin, SortableAdminBase, SortableAdminMixin
from categories.models import Attribute, AttributeGroup, AttributeOption

class ProductImageInline(SortableInlineAdminMixin, admin.TabularInline):
    model = ProductImage
    extra = 1
    max_num = 10
    fields = ['file', 'alt_text', 'position']
    ordering = ['position']

class ProductAttributeValueInline(admin.TabularInline):
    model = ProductAttributeValue
    extra = 0  # No extra empty forms by default
    fields = ['attribute', 'text_value', 'number_value', 'boolean_value', 'option_values']
    filter_horizontal = ['option_values']
    
    def formfield_for_foreignkey(self, db_field, request=None, **kwargs):
        if (db_field.name == 'attribute'):
            if hasattr(request, '_obj_') and request._obj_ and request._obj_.category:
                kwargs['queryset'] = Attribute.objects.filter(
                    group__categories=request._obj_.category
                ).distinct().order_by('group__name', 'name')
            else:
                kwargs['queryset'] = Attribute.objects.all().order_by('group__name', 'name')
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

class AttributeGroupSelectForm(forms.Form):
    """Form for selecting attribute groups to add to a product"""
    attribute_groups = forms.ModelMultipleChoiceField(
        queryset=AttributeGroup.objects.all(),
        widget=forms.CheckboxSelectMultiple,
        required=False,
        label="Select Attribute Groups to Add"
    )

@admin.register(VendorProduct)
class VendorProductAdmin(SortableAdminBase, admin.ModelAdmin):
    inlines = [ProductImageInline, ProductAttributeValueInline]
    list_display = ['name', 'vendor', 'price', 'stock', 'category', 'is_hot', 'display_order']
    list_filter = ['vendor', 'category', 'is_hot']
    search_fields = ['name', 'sku', 'description']
    readonly_fields = ['created_at']
    list_editable = ['display_order']  # Allow quick edit of ordering in list view
    
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
    
    def get_form(self, request, obj=None, **kwargs):
        # Store the object for use in formfield_for_foreignkey
        request._obj_ = obj
        return super().get_form(request, obj, **kwargs)
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                '<path:object_id>/add-attribute-groups/',
                self.admin_site.admin_view(self.add_attribute_groups_view),
                name='vendors_vendorproduct_add_attribute_groups',
            ),
        ]
        return custom_urls + urls
    
    def add_attribute_groups_view(self, request, object_id):
        """View to add attribute groups to a product"""
        product = self.get_object(request, object_id)
        
        if request.method == 'POST':
            form = AttributeGroupSelectForm(request.POST)
            if form.is_valid():
                attribute_groups = form.cleaned_data['attribute_groups']
                attributes_added = 0
                
                # For each selected group, add attributes that don't already exist
                for group in attribute_groups:
                    # Get product category compatible attributes from this group
                    attributes = Attribute.objects.filter(
                        group=group,
                        group__categories=product.category
                    )
                    
                    for attribute in attributes:
                        # Check if this attribute is already associated with the product
                        if not ProductAttributeValue.objects.filter(
                            product=product,
                            attribute=attribute
                        ).exists():
                            # Create the attribute value object with default values
                            attr_value = ProductAttributeValue(
                                product=product,
                                attribute=attribute
                            )
                            
                            # Set appropriate default value based on attribute type
                            if attribute.attribute_type == 'text':
                                attr_value.text_value = ''
                            elif attribute.attribute_type == 'number':
                                attr_value.number_value = None
                            elif attribute.attribute_type == 'boolean':
                                attr_value.boolean_value = False
                                
                            attr_value.save()
                            attributes_added += 1
                
                self.message_user(
                    request, 
                    f"{attributes_added} attributes added to {product.name} successfully."
                )
                return redirect(
                    'admin:vendors_vendorproduct_change',
                    object_id=object_id
                )
        else:
            form = AttributeGroupSelectForm()
            
            # Pre-select attribute groups that are related to the product's category
            if product.category:
                form.fields['attribute_groups'].queryset = AttributeGroup.objects.filter(
                    categories=product.category
                ).distinct()
        
        # Get existing attribute groups for the product
        existing_groups = AttributeGroup.objects.filter(
            attributes__product_values__product=product
        ).distinct()
        
        context = {
            'form': form,
            'product': product,
            'existing_groups': existing_groups,
            'opts': self.model._meta,
            'title': f'Add Attribute Groups to {product.name}'
        }
        
        return render(
            request,
            'admin/vendors/vendorproduct/add_attribute_groups.html',
            context
        )
    
    def change_view(self, request, object_id, form_url='', extra_context=None):
        """Override to add custom context for the change view"""
        extra_context = extra_context or {}
        extra_context['show_attribute_groups_button'] = True
        return super().change_view(
            request, object_id, form_url, extra_context=extra_context
        )

# Create a new admin for vendor with sorting capabilities
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
