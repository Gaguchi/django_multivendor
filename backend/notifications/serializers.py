from rest_framework import serializers
from .models import Notification, NotificationPreferences

class NotificationSerializer(serializers.ModelSerializer):
    icon_class = serializers.ReadOnlyField()
    color_class = serializers.ReadOnlyField()
    time_ago = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = [
            'id', 'notification_type', 'title', 'message', 'priority',
            'is_read', 'is_dismissed', 'created_at', 'read_at', 'dismissed_at',
            'expires_at', 'icon_class', 'color_class', 'time_ago', 'data',
            'related_order'
        ]
        read_only_fields = ['id', 'created_at', 'read_at', 'dismissed_at']
    
    def get_time_ago(self, obj):
        """Get human-readable time ago"""
        from django.utils import timezone
        from datetime import timedelta
        
        now = timezone.now()
        diff = now - obj.created_at
        
        if diff < timedelta(minutes=1):
            return "just now"
        elif diff < timedelta(hours=1):
            minutes = diff.seconds // 60
            return f"{minutes} minute{'s' if minutes != 1 else ''} ago"
        elif diff < timedelta(days=1):
            hours = diff.seconds // 3600
            return f"{hours} hour{'s' if hours != 1 else ''} ago"
        elif diff < timedelta(days=7):
            days = diff.days
            return f"{days} day{'s' if days != 1 else ''} ago"
        elif diff < timedelta(days=30):
            weeks = diff.days // 7
            return f"{weeks} week{'s' if weeks != 1 else ''} ago"
        else:
            months = diff.days // 30
            return f"{months} month{'s' if months != 1 else ''} ago"

class NotificationPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationPreferences
        fields = '__all__'
        read_only_fields = ['id', 'user', 'vendor', 'created_at', 'updated_at']

class NotificationBulkUpdateSerializer(serializers.Serializer):
    """Serializer for bulk notification operations"""
    notification_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=True,
        min_length=1
    )
    action = serializers.ChoiceField(
        choices=['mark_read', 'mark_unread', 'dismiss', 'undismiss'],
        required=True
    )
    
    def validate_notification_ids(self, value):
        """Validate that all notification IDs exist and belong to the user"""
        request = self.context.get('request')
        if not request:
            raise serializers.ValidationError("Request context is required")
        
        # Get user's vendor if applicable
        vendor = getattr(request, 'vendor', None)
        
        # Check if all notifications exist and belong to the user
        if vendor:
            existing_notifications = Notification.objects.filter(
                id__in=value,
                vendor=vendor
            ).values_list('id', flat=True)
        else:
            existing_notifications = Notification.objects.filter(
                id__in=value,
                recipient=request.user
            ).values_list('id', flat=True)
        
        if len(existing_notifications) != len(value):
            raise serializers.ValidationError("Some notifications do not exist or you don't have access to them")
        
        return value

class NotificationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating notifications (internal use)"""
    class Meta:
        model = Notification
        fields = [
            'recipient', 'vendor', 'notification_type', 'title', 'message',
            'priority', 'related_order', 'data', 'expires_at'
        ]
    
    def create(self, validated_data):
        """Create a new notification"""
        return Notification.objects.create(**validated_data)
