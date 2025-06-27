from django.contrib import admin
from .models import SearchLog, ProductTag, ProductTagAssociation, SearchResult


@admin.register(SearchLog)
class SearchLogAdmin(admin.ModelAdmin):
    list_display = ['search_query', 'search_date', 'results_count', 'response_time_ms', 'user_ip']
    list_filter = ['search_date', 'results_count']
    search_fields = ['search_query', 'user_ip']
    readonly_fields = ['search_date']
    date_hierarchy = 'search_date'
    
    def has_add_permission(self, request):
        return False  # Logs are created automatically
    
    def has_change_permission(self, request, obj=None):
        return False  # Logs should not be modified


@admin.register(ProductTag)
class ProductTagAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'created_at']
    list_filter = ['category', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at']


@admin.register(ProductTagAssociation)
class ProductTagAssociationAdmin(admin.ModelAdmin):
    list_display = ['product', 'tag', 'confidence', 'created_at']
    list_filter = ['confidence', 'created_at', 'tag']
    search_fields = ['product__name', 'tag__name']
    readonly_fields = ['created_at']
    raw_id_fields = ['product']  # Better for large datasets


@admin.register(SearchResult)
class SearchResultAdmin(admin.ModelAdmin):
    list_display = ['original_query', 'query_hash', 'created_at']
    list_filter = ['created_at']
    search_fields = ['original_query']
    readonly_fields = ['query_hash', 'created_at']
    
    def has_add_permission(self, request):
        return False  # Results are created automatically
    
    def has_change_permission(self, request, obj=None):
        return False  # Results should not be modified
