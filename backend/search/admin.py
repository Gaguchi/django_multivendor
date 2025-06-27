from django.contrib import admin
from .models import SearchLog, SearchResult

@admin.register(SearchLog)
class SearchLogAdmin(admin.ModelAdmin):
    list_display = ['query', 'user_display', 'search_type', 'results_count', 'processing_time', 'created_at']
    list_filter = ['search_type', 'created_at']
    search_fields = ['query', 'user__username']
    readonly_fields = ['user', 'session_key', 'query', 'search_type', 'results_count', 'processing_time', 'created_at']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    
    def user_display(self, obj):
        if obj.user:
            return obj.user.username
        return f"Session: {obj.session_key[:8]}..." if obj.session_key else "Anonymous"
    user_display.short_description = 'User'
    
    def has_add_permission(self, request):
        return False  # Prevent manual creation
    
    def has_change_permission(self, request, obj=None):
        return False  # Make read-only

@admin.register(SearchResult)
class SearchResultAdmin(admin.ModelAdmin):
    list_display = ['search_log_query', 'product', 'rank', 'relevance_score', 'matched_tags_display']
    list_filter = ['search_log__search_type', 'search_log__created_at']
    search_fields = ['search_log__query', 'product__name']
    readonly_fields = ['search_log', 'product', 'rank', 'relevance_score', 'matched_tags']
    ordering = ['search_log', 'rank']
    
    def search_log_query(self, obj):
        return obj.search_log.query[:50] + "..." if len(obj.search_log.query) > 50 else obj.search_log.query
    search_log_query.short_description = 'Search Query'
    
    def matched_tags_display(self, obj):
        if obj.matched_tags:
            try:
                import json
                tags = json.loads(obj.matched_tags)
                return ", ".join(tags[:3]) + ("..." if len(tags) > 3 else "")
            except:
                return obj.matched_tags[:30] + "..." if len(obj.matched_tags) > 30 else obj.matched_tags
        return "-"
    matched_tags_display.short_description = 'Matched Tags'
    
    def has_add_permission(self, request):
        return False  # Prevent manual creation
    
    def has_change_permission(self, request, obj=None):
        return False  # Make read-only
