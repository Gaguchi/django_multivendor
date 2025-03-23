from django.contrib import admin
from .models import Category, AttributeGroup, Attribute, AttributeOption
from adminsortable2.admin import SortableAdminMixin, SortableInlineAdminMixin

class AttributeOptionInline(SortableInlineAdminMixin, admin.TabularInline):
    model = AttributeOption
    extra = 1
    fields = ['value', 'display_order']
    ordering = ['display_order']

class AttributeInline(SortableInlineAdminMixin, admin.TabularInline):
    model = Attribute
    extra = 1
    fields = ['name', 'attribute_type', 'is_filterable', 'is_required', 'display_order']
    ordering = ['display_order']

@admin.register(Category)
class CategoryAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ['name', 'slug', 'parent_category', 'display_order']
    search_fields = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    list_filter = ['parent_category']
    list_editable = ['display_order']
    
    class Media:
        js = ('js/category_admin.js',)

@admin.register(AttributeGroup)
class AttributeGroupAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ['name', 'display_order', 'get_categories']
    search_fields = ['name']
    filter_horizontal = ['categories']
    inlines = [AttributeInline]
    
    def get_categories(self, obj):
        return ", ".join([c.name for c in obj.categories.all()])
    get_categories.short_description = 'Categories'

@admin.register(Attribute)
class AttributeAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ['name', 'group', 'attribute_type', 'is_filterable', 'is_required']
    list_filter = ['group', 'attribute_type', 'is_filterable', 'is_required']
    search_fields = ['name', 'group__name']
    inlines = [AttributeOptionInline]
    ordering = ['display_order']
    
    class Media:
        js = ('js/attribute_admin.js',)

@admin.register(AttributeOption)
class AttributeOptionAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ['value', 'attribute', 'display_order']
    list_filter = ['attribute__group', 'attribute']
    search_fields = ['value', 'attribute__name']