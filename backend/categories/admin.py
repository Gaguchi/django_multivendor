from django.contrib import admin
from django import forms
from django.utils.html import format_html
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
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['get_hierarchical_name', 'slug', 'get_level', 'product_count', 'display_order', 'get_children_count']
    search_fields = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    list_filter = ['parent_category']
    list_editable = ['display_order']
    ordering = ['display_order', 'name']
    
    def changelist_view(self, request, extra_context=None):
        """Override changelist view to add hierarchical ordering message"""
        from django.contrib import messages
        
        # Check if user is using sorting parameters that break hierarchical view
        if any(key in request.GET for key in ['o']) and 'q' not in request.GET:
            messages.info(request, 
                "🌳 To view categories in hierarchical tree order, remove the sorting by clicking on "
                "the column headers or visit the page without sort parameters."
            )
        elif 'q' not in request.GET:
            messages.success(request, 
                "🌳 Categories are displayed in hierarchical tree order. "
                "Root categories (📁) are shown first, followed by their subcategories."
            )
        
        return super().changelist_view(request, extra_context)
    
    def get_queryset(self, request):
        """Override to apply hierarchical ordering"""
        queryset = super().get_queryset(request).select_related('parent_category').prefetch_related('subcategories')
        
        # Apply hierarchical ordering unless there's a search query
        # (we exclude search because it would be confusing to show hierarchical order for search results)
        if 'q' not in request.GET or not request.GET.get('q', '').strip():
            # Get all categories and organize them hierarchically
            all_categories = list(queryset.all())
            ordered_categories = self._get_hierarchical_order(all_categories)
            
            if ordered_categories:
                # Get the IDs in hierarchical order
                ordered_ids = [cat.id for cat in ordered_categories]
                # Use a preserved order with Case/When
                from django.db.models import Case, When, IntegerField
                preserved = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(ordered_ids)])
                queryset = queryset.filter(id__in=ordered_ids).annotate(ordering=preserved).order_by('ordering')
        
        return queryset
    
    def _get_hierarchical_order(self, categories):
        """Organize categories in hierarchical order"""
        # Create lookup dictionaries
        children_by_parent = {}
        
        for cat in categories:
            parent_id = cat.parent_category_id
            if parent_id not in children_by_parent:
                children_by_parent[parent_id] = []
            children_by_parent[parent_id].append(cat)
        
        # Sort children by display_order and name
        for parent_id in children_by_parent:
            children_by_parent[parent_id].sort(key=lambda x: (x.display_order or 0, x.name))
        
        # Build hierarchical list starting with root categories
        def add_category_and_children(category, result):
            result.append(category)
            children = children_by_parent.get(category.id, [])
            for child in children:
                add_category_and_children(child, result)
        
        result = []
        root_categories = children_by_parent.get(None, [])
        for root_cat in root_categories:
            add_category_and_children(root_cat, result)
        
        return result
    
    def get_hierarchical_name(self, obj):
        """Display category name with hierarchical indentation and tree lines"""
        level = self.get_category_level(obj)
        
        # Create tree-like visual structure
        if level == 0:
            prefix = "📁 "  # Root category icon
        elif level == 1:
            prefix = "├── "  # First level branch
        elif level == 2:
            prefix = "│   ├── "  # Second level branch
        else:
            prefix = "│   " * (level - 1) + "├── "  # Deeper levels
            
        # Add level indicator with different styling
        level_indicator = f'<span class="level-{level}">{prefix}{obj.name}</span>'
        
        # Add children indicator if has subcategories
        children_count = obj.subcategories.count()
        if children_count > 0:
            level_indicator += f' <span class="children-indicator">({children_count} sub)</span>'
            
        return format_html(level_indicator)
    get_hierarchical_name.short_description = 'Category Tree'
    get_hierarchical_name.admin_order_field = 'name'
    
    def get_level(self, obj):
        """Display the hierarchical level with colored badge"""
        level = self.get_category_level(obj)
        return format_html(
            '<span class="level-badge level-{}">{}</span>',
            level,
            f'L{level}'
        )
    get_level.short_description = 'Level'
    
    def get_children_count(self, obj):
        """Display number of direct children"""
        count = obj.subcategories.count()
        if count > 0:
            return format_html(
                '<span class="children-count has-children">{}</span>',
                count
            )
        return format_html('<span class="children-count no-children">0</span>')
    get_children_count.short_description = 'Subcategories'
    
    def get_category_level(self, category):
        """Calculate the hierarchical level of a category"""
        level = 0
        current = category.parent_category
        while current:
            level += 1
            current = current.parent_category
        return level
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        """Customize the parent category dropdown to show hierarchical names"""
        if db_field.name == "parent_category":
            kwargs["queryset"] = Category.objects.all().order_by('parent_category__name', 'name')
            kwargs["widget"] = forms.Select(choices=self.get_hierarchical_choices())
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
    
    def get_hierarchical_choices(self):
        """Generate hierarchical choices for parent category dropdown"""
        choices = [('', '---------')]  # Empty choice
        
        def add_category_choices(categories, level=0):
            for category in categories:
                indent = "—" * level + " " if level > 0 else ""
                choices.append((category.id, f"{indent}{category.name}"))
                # Add children
                children = Category.objects.filter(parent_category=category).order_by('display_order', 'name')
                if children:
                    add_category_choices(children, level + 1)
        
        # Start with root categories
        root_categories = Category.objects.filter(parent_category=None).order_by('display_order', 'name')
        add_category_choices(root_categories)
        
        return choices
    
    class Media:
        js = ('js/category_admin.js',)
        css = {
            'all': ('css/hierarchical_admin.css',)
        }

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