import json
import logging
from datetime import datetime
from django.conf import settings
from .serializers import NotificationSerializer

logger = logging.getLogger(__name__)

def send_notification_websocket(notification):
    """
    Send real-time notification to vendor via WebSocket
    """
    try:
        # Only send if channels is available
        if not hasattr(settings, 'CHANNEL_LAYERS'):
            return
            
        from channels.layers import get_channel_layer
        from asgiref.sync import async_to_sync
        
        channel_layer = get_channel_layer()
        if not channel_layer:
            return
            
        # Get vendor ID from notification
        if not notification.vendor:
            logger.debug("Notification has no vendor, skipping WebSocket notification")
            return
            
        group_name = f'vendor_orders_{notification.vendor.id}'
        
        # Serialize notification data
        serializer = NotificationSerializer(notification)
        
        # Send the notification
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                'type': 'new_notification',
                'notification': serializer.data,
                'timestamp': datetime.now().isoformat()
            }
        )
        
        logger.info(f"Sent WebSocket notification {notification.id} to vendor {notification.vendor.id}")
        
    except ImportError:
        # Channels not installed, skip WebSocket notification
        logger.debug("Channels not available, skipping WebSocket notification")
    except Exception as e:
        logger.error(f"Error sending WebSocket notification: {e}")

def send_notification_update_websocket(notification):
    """
    Send real-time notification update to vendor via WebSocket
    """
    try:
        # Only send if channels is available
        if not hasattr(settings, 'CHANNEL_LAYERS'):
            return
            
        from channels.layers import get_channel_layer
        from asgiref.sync import async_to_sync
        
        channel_layer = get_channel_layer()
        if not channel_layer:
            return
            
        # Get vendor ID from notification
        if not notification.vendor:
            logger.debug("Notification has no vendor, skipping WebSocket notification update")
            return
            
        group_name = f'vendor_orders_{notification.vendor.id}'
        
        # Serialize notification data
        serializer = NotificationSerializer(notification)
        
        # Send the update
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                'type': 'notification_update',
                'notification': serializer.data,
                'timestamp': datetime.now().isoformat()
            }
        )
        
        logger.info(f"Sent WebSocket notification update {notification.id} to vendor {notification.vendor.id}")
        
    except ImportError:
        # Channels not installed, skip WebSocket notification
        logger.debug("Channels not available, skipping WebSocket notification update")
    except Exception as e:
        logger.error(f"Error sending WebSocket notification update: {e}")
