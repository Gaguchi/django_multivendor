from rest_framework import serializers
from django.contrib.auth.models import User
from vendors.models import Vendor
from .models import ChatRoom, ChatMessage, ChatParticipant


class UserBasicSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'full_name', 'email']
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username


class VendorBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = ['id', 'business_name', 'business_email', 'business_phone', 'logo']


class ChatRoomSerializer(serializers.ModelSerializer):
    customer = UserBasicSerializer(read_only=True)
    vendor = VendorBasicSerializer(read_only=True)
    participant_name = serializers.SerializerMethodField()
    participant_avatar = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatRoom
        fields = [
            'id', 'customer', 'vendor', 'created_at', 'updated_at', 
            'is_active', 'last_message_text', 'last_message_timestamp',
            'last_message_sender_type', 'unread_by_customer', 'unread_by_vendor',
            'participant_name', 'participant_avatar'
        ]
    
    def get_participant_name(self, obj):
        """Get the name of the other participant (not the current user)"""
        request_user = self.context.get('request').user if self.context.get('request') else None
        if not request_user:
            return None
        
        # Check if current user is the customer
        if obj.customer == request_user:
            return obj.vendor.business_name
        else:
            # Current user is the vendor, return customer name
            return f"{obj.customer.first_name} {obj.customer.last_name}".strip() or obj.customer.username
    
    def get_participant_avatar(self, obj):
        """Get the avatar/logo of the other participant"""
        request_user = self.context.get('request').user if self.context.get('request') else None
        if not request_user:
            return None
        
        # Check if current user is the customer
        if obj.customer == request_user:
            return obj.vendor.logo.url if obj.vendor.logo else None
        else:
            # For customer avatar, we might not have one, return None for now
            return None


class ChatMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()
    sender_avatar = serializers.SerializerMethodField()
    is_own_message = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatMessage
        fields = [
            'id', 'chat_room', 'sender_type', 'content', 'message_type',
            'attachment', 'timestamp', 'is_read', 'metadata',
            'sender_name', 'sender_avatar', 'is_own_message'
        ]
        read_only_fields = ['id', 'timestamp', 'sender_name', 'sender_avatar', 'is_own_message']
    
    def get_sender_name(self, obj):
        if obj.sender_type == 'customer' and obj.sender_user:
            return f"{obj.sender_user.first_name} {obj.sender_user.last_name}".strip() or obj.sender_user.username
        elif obj.sender_type == 'vendor' and obj.sender_vendor:
            return obj.sender_vendor.business_name
        else:
            return 'System'
    
    def get_sender_avatar(self, obj):
        if obj.sender_type == 'vendor' and obj.sender_vendor:
            return obj.sender_vendor.logo.url if obj.sender_vendor.logo else None
        return None
    
    def get_is_own_message(self, obj):
        """Check if this message was sent by the current user"""
        request_user = self.context.get('request').user if self.context.get('request') else None
        if not request_user:
            return False
        
        if obj.sender_type == 'customer':
            return obj.sender_user == request_user
        elif obj.sender_type == 'vendor':
            try:
                vendor = Vendor.objects.get(user=request_user)
                return obj.sender_vendor == vendor
            except Vendor.DoesNotExist:
                return False
        
        return False


class ChatParticipantSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)
    vendor = VendorBasicSerializer(read_only=True)
    participant_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatParticipant
        fields = [
            'id', 'chat_room', 'user', 'vendor', 'participant_type',
            'last_seen', 'is_online', 'is_typing', 'typing_timestamp',
            'participant_name'
        ]
    
    def get_participant_name(self, obj):
        if obj.participant_type == 'customer' and obj.user:
            return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username
        elif obj.participant_type == 'vendor' and obj.vendor:
            return obj.vendor.business_name
        return 'Unknown'
