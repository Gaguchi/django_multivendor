from django.contrib import admin
from .models import Category, AttributeGroup, Attribute, AttributeOption

class AttributeOptionInline(admin.TabularInline):
    model = AttributeOption
    extra = 1
    fields = ['value', 'display_order']
    
class AttributeInline(admin.TabularInline):
    model = Attribute
    extra = 1
    fields = ['name', 'attribute_type', 'is_filterable', 'is_required', 'display_order']
    show_change_link = True

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'parent_category', 'created_at']
    list_filter = ['parent_category']
    search_fields = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    
@admin.register(AttributeGroup)
class AttributeGroupAdmin(admin.ModelAdmin):
    list_display = ['name', 'display_order', 'get_categories']
    list_filter = ['categories']
    search_fields = ['name']
    inlines = [AttributeInline]
    filter_horizontal = ['categories']
    
    def get_categories(self, obj):
        return ", ".join([c.name for c in obj.categories.all()])
    get_categories.short_description = 'Categories'

@admin.register(Attribute)
class AttributeAdmin(admin.ModelAdmin):
    list_display = ['name', 'group', 'attribute_type', 'is_filterable', 'display_order']
    list_filter = ['group', 'attribute_type', 'is_filterable']
    search_fields = ['name', 'group__name']
    inlines = [AttributeOptionInline]