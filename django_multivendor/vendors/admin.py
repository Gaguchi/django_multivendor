from django.contrib import admin
from .models import Vendor, VendorProduct, ProductImage
from adminsortable2.admin import SortableInlineAdminMixin, SortableAdminBase  # Added SortableAdminBase

class ProductImageInline(SortableInlineAdminMixin, admin.TabularInline):  # Updated inheritance
    model = ProductImage
    extra = 1
    max_num = 10
    fields = ['file', 'position']
    ordering = ['position']
    # Removed classes and Media
    
@admin.register(VendorProduct)
class VendorProductAdmin(SortableAdminBase, admin.ModelAdmin):  # Updated inheritance
    inlines = [ProductImageInline]
    list_display = ['name', 'vendor', 'price', 'stock']
    list_filter = ['vendor']
    search_fields = ['name', 'sku']

admin.site.register(Vendor)
