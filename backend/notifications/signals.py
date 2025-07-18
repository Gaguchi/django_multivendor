from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.utils import timezone
from orders.models import Order, OrderItem
from vendors.models import Vendor
from .models import Notification, NotificationPreferences
from .services import NotificationService
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Order)
def handle_order_status_change(sender, instance, created, **kwargs):
    """Handle order status changes and create notifications"""
    try:
        if created:
            # Don't create notifications here - wait for OrderItem to be saved
            # The notification will be created when the first OrderItem is saved
            pass
        
        else:
            # Order status changed - notify vendors
            if instance.status == 'Paid':
                NotificationService.notify_vendors_of_order_payment(instance)
                logger.info(f"Created payment notifications for order {instance.order_number}")
            
            elif instance.status == 'Shipped':
                NotificationService.notify_vendors_of_order_shipped(instance)
                logger.info(f"Created shipping notifications for order {instance.order_number}")
            
            elif instance.status == 'Delivered':
                NotificationService.notify_vendors_of_order_delivered(instance)
                logger.info(f"Created delivery notifications for order {instance.order_number}")
            
            elif instance.status == 'Completed':
                NotificationService.notify_vendors_of_payment_cleared(instance)
                logger.info(f"Created payment cleared notifications for order {instance.order_number}")
    
    except Exception as e:
        logger.error(f"Error handling order status change for order {instance.order_number}: {e}")

@receiver(post_save, sender=OrderItem)
def handle_order_item_creation(sender, instance, created, **kwargs):
    """Handle order item creation and create notifications for new orders"""
    try:
        if created:
            # Check if this is the first item for this order
            order = instance.order
            order_items_count = order.items.count()
            
            if order_items_count == 1:
                # This is the first item, create new order notifications
                NotificationService.notify_vendors_of_new_order(order)
                logger.info(f"Created new order notifications for order {order.order_number}")
    
    except Exception as e:
        logger.error(f"Error handling order item creation for order {instance.order.order_number}: {e}")

@receiver(post_save, sender=User)
def create_notification_preferences(sender, instance, created, **kwargs):
    """Create default notification preferences for new users"""
    if created:
        try:
            NotificationPreferences.objects.create(user=instance)
            logger.info(f"Created notification preferences for user {instance.username}")
        except Exception as e:
            logger.error(f"Error creating notification preferences for user {instance.username}: {e}")

@receiver(post_save, sender=Vendor)
def create_vendor_notification_preferences(sender, instance, created, **kwargs):
    """Create vendor-specific notification preferences"""
    if created:
        try:
            NotificationPreferences.objects.create(
                user=instance.user,
                vendor=instance
            )
            logger.info(f"Created vendor notification preferences for {instance.store_name}")
        except Exception as e:
            logger.error(f"Error creating vendor notification preferences for {instance.store_name}: {e}")

# Signal to clean up old notifications (can be called periodically)
def cleanup_old_notifications():
    """Clean up old read notifications and expired notifications"""
    from datetime import timedelta
    
    # Delete read notifications older than 30 days
    old_read_notifications = Notification.objects.filter(
        is_read=True,
        read_at__lt=timezone.now() - timedelta(days=30)
    )
    
    deleted_count = old_read_notifications.count()
    old_read_notifications.delete()
    
    # Delete expired notifications
    expired_notifications = Notification.objects.filter(
        expires_at__lt=timezone.now()
    )
    
    expired_count = expired_notifications.count()
    expired_notifications.delete()
    
    logger.info(f"Cleaned up {deleted_count} old read notifications and {expired_count} expired notifications")
    
    return deleted_count + expired_count
