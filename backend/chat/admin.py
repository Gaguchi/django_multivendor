from django.contrib import admin
from .models import ChatRoom, ChatMessage, ChatParticipant


@admin.register(ChatRoom)
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'customer', 'vendor', 'last_message_text_short', 
        'last_message_timestamp', 'unread_by_customer', 'unread_by_vendor',
        'is_active', 'created_at'
    ]
    list_filter = ['is_active', 'created_at', 'last_message_sender_type']
    search_fields = [
        'customer__username', 'customer__first_name', 'customer__last_name',
        'vendor__business_name', 'last_message_text'
    ]
    readonly_fields = ['created_at', 'updated_at']
    
    def last_message_text_short(self, obj):
        if obj.last_message_text:
            return obj.last_message_text[:50] + ('...' if len(obj.last_message_text) > 50 else '')
        return '-'
    last_message_text_short.short_description = 'Last Message'


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'chat_room', 'sender_type', 'sender_name', 
        'content_short', 'message_type', 'timestamp', 'is_read'
    ]
    list_filter = ['sender_type', 'message_type', 'is_read', 'timestamp']
    search_fields = ['content', 'chat_room__customer__username', 'chat_room__vendor__business_name']
    readonly_fields = ['timestamp']
    
    def content_short(self, obj):
        return obj.content[:50] + ('...' if len(obj.content) > 50 else '')
    content_short.short_description = 'Content'
    
    def sender_name(self, obj):
        if obj.sender_type == 'customer' and obj.sender_user:
            return f"{obj.sender_user.first_name} {obj.sender_user.last_name}".strip() or obj.sender_user.username
        elif obj.sender_type == 'vendor' and obj.sender_vendor:
            return obj.sender_vendor.business_name
        else:
            return 'System'
    sender_name.short_description = 'Sender'


@admin.register(ChatParticipant)
class ChatParticipantAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'chat_room', 'participant_type', 'participant_name',
        'is_online', 'is_typing', 'last_seen'
    ]
    list_filter = ['participant_type', 'is_online', 'is_typing', 'last_seen']
    search_fields = ['user__username', 'vendor__business_name']
    
    def participant_name(self, obj):
        if obj.participant_type == 'customer' and obj.user:
            return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username
        elif obj.participant_type == 'vendor' and obj.vendor:
            return obj.vendor.business_name
        return 'Unknown'
    participant_name.short_description = 'Participant'
