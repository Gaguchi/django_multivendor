from django.db import models
from django.contrib.auth.models import User
from vendors.models import Vendor
from django.utils import timezone


class ChatRoom(models.Model):
    """
    Represents a chat room between a customer and a vendor
    """
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='customer_chats')
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='vendor_chats')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    # Store last message for quick display
    last_message_text = models.TextField(blank=True, null=True)
    last_message_timestamp = models.DateTimeField(null=True, blank=True)
    last_message_sender_type = models.CharField(max_length=10, choices=[
        ('customer', 'Customer'),
        ('vendor', 'Vendor')
    ], null=True, blank=True)
    
    # Unread message counts
    unread_by_customer = models.IntegerField(default=0)
    unread_by_vendor = models.IntegerField(default=0)
    
    class Meta:
        unique_together = ('customer', 'vendor')
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"Chat: {self.customer.username} <-> {self.vendor.business_name}"
    
    def update_last_message(self, message):
        """Update the last message info for quick display"""
        self.last_message_text = message.content
        self.last_message_timestamp = message.timestamp
        self.last_message_sender_type = message.sender_type
        self.updated_at = timezone.now()
        self.save(update_fields=[
            'last_message_text', 
            'last_message_timestamp', 
            'last_message_sender_type',
            'updated_at'
        ])
    
    def mark_read_by_customer(self):
        """Mark all messages as read by customer"""
        self.unread_by_customer = 0
        self.save(update_fields=['unread_by_customer'])
    
    def mark_read_by_vendor(self):
        """Mark all messages as read by vendor"""
        self.unread_by_vendor = 0
        self.save(update_fields=['unread_by_vendor'])


class ChatMessage(models.Model):
    """
    Individual messages in a chat room
    """
    SENDER_TYPES = [
        ('customer', 'Customer'),
        ('vendor', 'Vendor'),
        ('system', 'System')
    ]
    
    MESSAGE_TYPES = [
        ('text', 'Text'),
        ('image', 'Image'),
        ('file', 'File'),
        ('system', 'System Message')
    ]
    
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender_type = models.CharField(max_length=10, choices=SENDER_TYPES)
    sender_user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    sender_vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, null=True, blank=True)
    
    content = models.TextField()
    message_type = models.CharField(max_length=10, choices=MESSAGE_TYPES, default='text')
    
    # File attachment (if any)
    attachment = models.FileField(upload_to='chat_attachments/', null=True, blank=True)
    
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    
    # For system messages or metadata
    metadata = models.JSONField(default=dict, blank=True)
    
    class Meta:
        ordering = ['timestamp']
    
    def __str__(self):
        sender = self.sender_user.username if self.sender_user else (
            self.sender_vendor.business_name if self.sender_vendor else 'System'
        )
        return f"{sender}: {self.content[:50]}..."
    
    def save(self, *args, **kwargs):
        # Auto-set sender based on sender_type
        if self.sender_type == 'customer' and self.sender_user:
            pass  # Already set
        elif self.sender_type == 'vendor' and self.sender_vendor:
            pass  # Already set
        
        super().save(*args, **kwargs)
        
        # Update chat room's last message
        self.chat_room.update_last_message(self)
        
        # Increment unread count for the recipient
        if self.sender_type == 'customer':
            self.chat_room.unread_by_vendor += 1
            self.chat_room.save(update_fields=['unread_by_vendor'])
        elif self.sender_type == 'vendor':
            self.chat_room.unread_by_customer += 1
            self.chat_room.save(update_fields=['unread_by_customer'])


class ChatParticipant(models.Model):
    """
    Track active participants in chat rooms for real-time features
    """
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='participants')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, null=True, blank=True)
    participant_type = models.CharField(max_length=10, choices=[
        ('customer', 'Customer'),
        ('vendor', 'Vendor')
    ])
    
    # Activity tracking
    last_seen = models.DateTimeField(auto_now=True)
    is_online = models.BooleanField(default=False)
    is_typing = models.BooleanField(default=False)
    typing_timestamp = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ('chat_room', 'user', 'vendor')
    
    def __str__(self):
        participant = self.user.username if self.user else self.vendor.business_name
        return f"{participant} in {self.chat_room}"
