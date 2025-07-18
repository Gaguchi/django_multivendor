from django.db import models
from django.contrib.auth.models import User
from vendors.models import Vendor
from orders.models import Order
from django.utils import timezone

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('order_created', 'New Order'),
        ('order_paid', 'Order Paid'),
        ('order_shipped', 'Order Shipped'),
        ('order_delivered', 'Order Delivered'),
        ('order_cancelled', 'Order Cancelled'),
        ('payment_cleared', 'Payment Cleared'),
        ('dispute_raised', 'Dispute Raised'),
        ('product_low_stock', 'Low Stock Alert'),
        ('product_out_of_stock', 'Out of Stock Alert'),
        ('review_received', 'New Review'),
        ('system_announcement', 'System Announcement'),
    ]

    PRIORITY_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]

    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='notifications', null=True, blank=True)
    
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_LEVELS, default='medium')
    
    # Related objects
    related_order = models.ForeignKey(Order, on_delete=models.CASCADE, null=True, blank=True)
    
    # Metadata
    data = models.JSONField(default=dict, blank=True)  # Additional data for the notification
    
    # Status tracking
    is_read = models.BooleanField(default=False)
    is_dismissed = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    dismissed_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)  # For temporary notifications
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'is_read']),
            models.Index(fields=['vendor', 'is_read']),
            models.Index(fields=['notification_type']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.recipient.username}"
    
    def mark_as_read(self):
        """Mark notification as read"""
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at'])
    
    def mark_as_dismissed(self):
        """Mark notification as dismissed"""
        if not self.is_dismissed:
            self.is_dismissed = True
            self.dismissed_at = timezone.now()
            self.save(update_fields=['is_dismissed', 'dismissed_at'])
    
    def is_expired(self):
        """Check if notification is expired"""
        if self.expires_at:
            return timezone.now() > self.expires_at
        return False
    
    @property
    def icon_class(self):
        """Return appropriate icon class based on notification type"""
        icon_map = {
            'order_created': 'icon-shopping-cart',
            'order_paid': 'icon-credit-card',
            'order_shipped': 'icon-truck',
            'order_delivered': 'icon-check-circle',
            'order_cancelled': 'icon-x-circle',
            'payment_cleared': 'icon-dollar-sign',
            'dispute_raised': 'icon-alert-triangle',
            'product_low_stock': 'icon-alert-circle',
            'product_out_of_stock': 'icon-alert-triangle',
            'review_received': 'icon-star',
            'system_announcement': 'icon-bell',
        }
        return icon_map.get(self.notification_type, 'icon-bell')
    
    @property
    def color_class(self):
        """Return appropriate color class based on priority"""
        color_map = {
            'low': 'text-muted',
            'medium': 'text-primary',
            'high': 'text-warning',
            'urgent': 'text-danger',
        }
        return color_map.get(self.priority, 'text-primary')

class NotificationPreferences(models.Model):
    """User preferences for different types of notifications"""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='notification_preferences')
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, null=True, blank=True)
    
    # Email notifications
    email_order_created = models.BooleanField(default=True)
    email_order_paid = models.BooleanField(default=True)
    email_order_shipped = models.BooleanField(default=False)
    email_order_delivered = models.BooleanField(default=False)
    email_payment_cleared = models.BooleanField(default=True)
    email_dispute_raised = models.BooleanField(default=True)
    email_low_stock = models.BooleanField(default=True)
    email_reviews = models.BooleanField(default=True)
    email_system_announcements = models.BooleanField(default=True)
    
    # In-app notifications
    app_order_created = models.BooleanField(default=True)
    app_order_paid = models.BooleanField(default=True)
    app_order_shipped = models.BooleanField(default=True)
    app_order_delivered = models.BooleanField(default=True)
    app_payment_cleared = models.BooleanField(default=True)
    app_dispute_raised = models.BooleanField(default=True)
    app_low_stock = models.BooleanField(default=True)
    app_reviews = models.BooleanField(default=True)
    app_system_announcements = models.BooleanField(default=True)
    
    # WebSocket/Real-time notifications
    realtime_order_created = models.BooleanField(default=True)
    realtime_order_paid = models.BooleanField(default=True)
    realtime_order_shipped = models.BooleanField(default=False)
    realtime_order_delivered = models.BooleanField(default=False)
    realtime_payment_cleared = models.BooleanField(default=True)
    realtime_dispute_raised = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Notification Preferences - {self.user.username}"
    
    def get_preference(self, notification_type, channel='app'):
        """Get preference for a specific notification type and channel"""
        field_name = f"{channel}_{notification_type}"
        return getattr(self, field_name, True)
