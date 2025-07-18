from django.contrib import admin
from .models import Notification, NotificationPreferences

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'recipient', 'vendor', 'notification_type', 'priority', 'is_read', 'created_at']
    list_filter = ['notification_type', 'priority', 'is_read', 'is_dismissed', 'created_at']
    search_fields = ['title', 'message', 'recipient__username', 'vendor__store_name']
    readonly_fields = ['created_at', 'read_at', 'dismissed_at']
    
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related('recipient', 'vendor', 'related_order')

@admin.register(NotificationPreferences)
class NotificationPreferencesAdmin(admin.ModelAdmin):
    list_display = ['user', 'vendor', 'email_order_created', 'app_order_created', 'created_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['user__username', 'vendor__store_name']
    readonly_fields = ['created_at', 'updated_at']
