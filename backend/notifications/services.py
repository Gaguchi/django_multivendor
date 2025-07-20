from django.utils import timezone
from django.contrib.auth.models import User
from orders.models import Order
from vendors.models import Vendor
from .models import Notification, NotificationPreferences
from .websocket import send_notification_websocket
import logging

logger = logging.getLogger(__name__)

class NotificationService:
    """Service class for creating and managing notifications"""
    
    @staticmethod
    def create_notification(
        recipient,
        notification_type,
        title,
        message,
        vendor=None,
        priority='medium',
        related_order=None,
        data=None,
        expires_at=None
    ):
        """Create a new notification"""
        try:
            # Check if user has notification preferences
            if vendor:
                preferences = NotificationPreferences.objects.filter(
                    user=recipient,
                    vendor=vendor
                ).first()
            else:
                preferences = NotificationPreferences.objects.filter(
                    user=recipient,
                    vendor__isnull=True
                ).first()
            
            # Check if user wants this type of notification
            if preferences:
                if not preferences.get_preference(notification_type, 'app'):
                    logger.info(f"User {recipient.username} has disabled {notification_type} notifications")
                    return None
            
            notification = Notification.objects.create(
                recipient=recipient,
                vendor=vendor,
                notification_type=notification_type,
                title=title,
                message=message,
                priority=priority,
                related_order=related_order,
                data=data or {},
                expires_at=expires_at
            )
            
            logger.info(f"Created notification {notification.id} for {recipient.username}")
            
            # Send WebSocket notification for real-time updates
            send_notification_websocket(notification)
            
            return notification
            
        except Exception as e:
            logger.error(f"Error creating notification: {e}")
            return None
    
    @staticmethod
    def notify_vendors_of_new_order(order):
        """Notify all vendors that have products in a new order"""
        try:
            vendors = order.get_vendors()
            
            for vendor in vendors:
                vendor_items = order.get_vendor_items(vendor)
                vendor_total = order.get_vendor_total(vendor)
                
                # Count items
                item_count = vendor_items.count()
                item_names = [item.product.name for item in vendor_items[:3]]  # First 3 items
                
                if item_count > 3:
                    item_names.append(f"and {item_count - 3} more items")
                
                title = f"New Order #{order.order_number}"
                message = f"You have a new order containing {item_count} item{'s' if item_count != 1 else ''}: {', '.join(item_names)}. Total: ${vendor_total:.2f}"
                
                NotificationService.create_notification(
                    recipient=vendor.user,
                    vendor=vendor,
                    notification_type='order_created',
                    title=title,
                    message=message,
                    priority='high',
                    related_order=order,
                    data={
                        'order_number': order.order_number,
                        'item_count': item_count,
                        'vendor_total': float(vendor_total),
                        'items': [{'name': item.product.name, 'quantity': item.quantity} for item in vendor_items]
                    }
                )
                
        except Exception as e:
            logger.error(f"Error notifying vendors of new order {order.order_number}: {e}")
    
    @staticmethod
    def notify_vendors_of_order_payment(order):
        """Notify vendors that an order has been paid"""
        try:
            vendors = order.get_vendors()
            
            for vendor in vendors:
                vendor_total = order.get_vendor_total(vendor)
                
                title = f"Order #{order.order_number} Paid"
                message = f"Order #{order.order_number} has been paid. Your portion: ${vendor_total:.2f}. You can now prepare the items for shipping."
                
                NotificationService.create_notification(
                    recipient=vendor.user,
                    vendor=vendor,
                    notification_type='order_paid',
                    title=title,
                    message=message,
                    priority='high',
                    related_order=order,
                    data={
                        'order_number': order.order_number,
                        'vendor_total': float(vendor_total)
                    }
                )
                
        except Exception as e:
            logger.error(f"Error notifying vendors of order payment {order.order_number}: {e}")
    
    @staticmethod
    def notify_vendors_of_order_shipped(order):
        """Notify vendors that an order has been shipped"""
        try:
            vendors = order.get_vendors()
            
            for vendor in vendors:
                title = f"Order #{order.order_number} Shipped"
                message = f"Order #{order.order_number} has been marked as shipped. The customer will be notified."
                
                NotificationService.create_notification(
                    recipient=vendor.user,
                    vendor=vendor,
                    notification_type='order_shipped',
                    title=title,
                    message=message,
                    priority='medium',
                    related_order=order,
                    data={
                        'order_number': order.order_number
                    }
                )
                
        except Exception as e:
            logger.error(f"Error notifying vendors of order shipping {order.order_number}: {e}")
    
    @staticmethod
    def notify_vendors_of_order_delivered(order):
        """Notify vendors that an order has been delivered"""
        try:
            vendors = order.get_vendors()
            
            for vendor in vendors:
                title = f"Order #{order.order_number} Delivered"
                message = f"Order #{order.order_number} has been delivered. Payment will be cleared to you in 7 days unless a dispute is raised."
                
                NotificationService.create_notification(
                    recipient=vendor.user,
                    vendor=vendor,
                    notification_type='order_delivered',
                    title=title,
                    message=message,
                    priority='medium',
                    related_order=order,
                    data={
                        'order_number': order.order_number,
                        'clearance_date': (order.delivered_at + timezone.timedelta(days=7)).isoformat() if order.delivered_at else None
                    }
                )
                
        except Exception as e:
            logger.error(f"Error notifying vendors of order delivery {order.order_number}: {e}")
    
    @staticmethod
    def notify_vendors_of_payment_cleared(order):
        """Notify vendors that payment has been cleared"""
        try:
            vendors = order.get_vendors()
            
            for vendor in vendors:
                vendor_total = order.get_vendor_total(vendor)
                
                title = f"Payment Cleared - Order #{order.order_number}"
                message = f"Payment of ${vendor_total:.2f} for order #{order.order_number} has been cleared to your account."
                
                NotificationService.create_notification(
                    recipient=vendor.user,
                    vendor=vendor,
                    notification_type='payment_cleared',
                    title=title,
                    message=message,
                    priority='high',
                    related_order=order,
                    data={
                        'order_number': order.order_number,
                        'vendor_total': float(vendor_total)
                    }
                )
                
        except Exception as e:
            logger.error(f"Error notifying vendors of payment clearance {order.order_number}: {e}")
    
    @staticmethod
    def notify_vendor_of_low_stock(vendor_product):
        """Notify vendor of low stock for a product"""
        try:
            title = f"Low Stock Alert - {vendor_product.name}"
            message = f"Your product '{vendor_product.name}' is running low on stock. Current quantity: {vendor_product.quantity}"
            
            NotificationService.create_notification(
                recipient=vendor_product.vendor.user,
                vendor=vendor_product.vendor,
                notification_type='product_low_stock',
                title=title,
                message=message,
                priority='medium',
                data={
                    'product_id': vendor_product.id,
                    'product_name': vendor_product.name,
                    'current_quantity': vendor_product.quantity,
                    'threshold': 10  # Could be configurable
                }
            )
            
        except Exception as e:
            logger.error(f"Error notifying vendor of low stock: {e}")
    
    @staticmethod
    def notify_vendor_of_new_review(vendor_product, review):
        """Notify vendor of a new review for their product"""
        try:
            title = f"New Review - {vendor_product.name}"
            message = f"Your product '{vendor_product.name}' received a new {review.rating}-star review from {review.user.username}."
            
            NotificationService.create_notification(
                recipient=vendor_product.vendor.user,
                vendor=vendor_product.vendor,
                notification_type='review_received',
                title=title,
                message=message,
                priority='low',
                data={
                    'product_id': vendor_product.id,
                    'product_name': vendor_product.name,
                    'rating': review.rating,
                    'reviewer': review.user.username,
                    'review_id': review.id
                }
            )
            
        except Exception as e:
            logger.error(f"Error notifying vendor of new review: {e}")
    
    @staticmethod
    def get_notification_count(user, vendor=None, unread_only=True):
        """Get notification count for a user/vendor"""
        try:
            queryset = Notification.objects.filter(recipient=user)
            
            if vendor:
                queryset = queryset.filter(vendor=vendor)
            
            if unread_only:
                queryset = queryset.filter(is_read=False)
            
            return queryset.count()
            
        except Exception as e:
            logger.error(f"Error getting notification count: {e}")
            return 0
    
    @staticmethod
    def mark_notifications_as_read(user, vendor=None, notification_type=None):
        """Mark multiple notifications as read"""
        try:
            queryset = Notification.objects.filter(
                recipient=user,
                is_read=False
            )
            
            if vendor:
                queryset = queryset.filter(vendor=vendor)
            
            if notification_type:
                queryset = queryset.filter(notification_type=notification_type)
            
            updated_count = queryset.update(
                is_read=True,
                read_at=timezone.now()
            )
            
            logger.info(f"Marked {updated_count} notifications as read for user {user.username}")
            return updated_count
            
        except Exception as e:
            logger.error(f"Error marking notifications as read: {e}")
            return 0
