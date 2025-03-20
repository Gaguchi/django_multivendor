from django.contrib import admin
from .models import Vendor, VendorProduct, ProductImage, ProductAttributeValue
from adminsortable2.admin import SortableInlineAdminMixin, SortableAdminBase
from categories.models import Attribute

class ProductImageInline(SortableInlineAdminMixin, admin.TabularInline):
    model = ProductImage
    extra = 1
    max_num = 10
    fields = ['file', 'position']
    ordering = ['position']

class ProductAttributeValueInline(admin.TabularInline):
    model = ProductAttributeValue
    extra = 1
    fields = ['attribute', 'text_value', 'number_value', 'boolean_value', 'option_values']
    filter_horizontal = ['option_values']
    
    def formfield_for_foreignkey(self, db_field, request=None, **kwargs):
        if db_field.name == 'attribute':
            if hasattr(request, '_obj_') and request._obj_ and request._obj_.category:
                kwargs['queryset'] = Attribute.objects.filter(
                    group__categories=request._obj_.category
                ).distinct().order_by('group__name', 'name')
            else:
                kwargs['queryset'] = Attribute.objects.all().order_by('group__name', 'name')
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
    
@admin.register(VendorProduct)
class VendorProductAdmin(SortableAdminBase, admin.ModelAdmin):
    inlines = [ProductImageInline, ProductAttributeValueInline]
    list_display = ['name', 'vendor', 'price', 'stock', 'category']
    list_filter = ['vendor', 'category', 'is_hot']
    search_fields = ['name', 'sku', 'description']
    
    def get_form(self, request, obj=None, **kwargs):
        request._obj_ = obj
        return super().get_form(request, obj, **kwargs)

admin.site.register(Vendor)
