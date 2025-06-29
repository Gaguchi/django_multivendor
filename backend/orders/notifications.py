import json
import logging
from datetime import datetime
from django.conf import settings

logger = logging.getLogger(__name__)

def send_order_status_update(order, vendor_id):
    """
    Send real-time order status update to vendor via WebSocket
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
            
        group_name = f'vendor_orders_{vendor_id}'
        
        # Send the update
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                'type': 'order_status_update',
                'order_number': order.order_number,
                'status': order.status,
                'vendor_id': str(vendor_id),
                'timestamp': datetime.now().isoformat()
            }
        )
        
        logger.info(f"Sent WebSocket update for order {order.order_number} to vendor {vendor_id}")
        
    except ImportError:
        # Channels not installed, skip WebSocket notification
        logger.debug("Channels not available, skipping WebSocket notification")
    except Exception as e:
        logger.error(f"Error sending WebSocket notification: {e}")

def send_new_order_notification(order, vendor_id):
    """
    Send real-time notification for new orders to vendor via WebSocket
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
            
        group_name = f'vendor_orders_{vendor_id}'
        
        # Send the notification
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                'type': 'order_created',
                'order_number': order.order_number,
                'vendor_id': str(vendor_id),
                'timestamp': datetime.now().isoformat()
            }
        )
        
        logger.info(f"Sent new order notification for {order.order_number} to vendor {vendor_id}")
        
    except ImportError:
        # Channels not installed, skip WebSocket notification
        logger.debug("Channels not available, skipping WebSocket notification")
    except Exception as e:
        logger.error(f"Error sending new order notification: {e}")
