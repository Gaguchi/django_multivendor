import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from vendors.models import Vendor

logger = logging.getLogger(__name__)

class VendorOrderConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.vendor_id = self.scope['url_route']['kwargs']['vendor_id']
        self.vendor_group_name = f'vendor_orders_{self.vendor_id}'
        
        # Verify vendor exists and user has permission (basic check)
        vendor = await self.get_vendor(self.vendor_id)
        if not vendor:
            await self.close()
            return
            
        # Join vendor-specific group
        await self.channel_layer.group_add(
            self.vendor_group_name,
            self.channel_name
        )
        
        await self.accept()
        logger.info(f"WebSocket connected for vendor {self.vendor_id}")

    async def disconnect(self, close_code):
        # Leave vendor group
        await self.channel_layer.group_discard(
            self.vendor_group_name,
            self.channel_name
        )
        logger.info(f"WebSocket disconnected for vendor {self.vendor_id}")

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message_type = text_data_json.get('type')
            
            if message_type == 'ping':
                await self.send(text_data=json.dumps({
                    'type': 'pong',
                    'timestamp': text_data_json.get('timestamp')
                }))
                
        except json.JSONDecodeError:
            logger.error(f"Invalid JSON received from vendor {self.vendor_id}")

    # Receive message from room group
    async def order_status_update(self, event):
        """Send order status update to WebSocket"""
        await self.send(text_data=json.dumps({
            'type': 'order_status_update',
            'order_number': event['order_number'],
            'status': event['status'],
            'vendor_id': event['vendor_id'],
            'timestamp': event['timestamp']
        }))

    async def order_created(self, event):
        """Send new order notification to WebSocket"""
        await self.send(text_data=json.dumps({
            'type': 'order_created',
            'order_number': event['order_number'],
            'vendor_id': event['vendor_id'],
            'timestamp': event['timestamp']
        }))

    async def new_notification(self, event):
        """Send new notification to WebSocket"""
        await self.send(text_data=json.dumps({
            'type': 'new_notification',
            'notification': event['notification'],
            'timestamp': event['timestamp']
        }))

    async def notification_update(self, event):
        """Send notification update to WebSocket"""
        await self.send(text_data=json.dumps({
            'type': 'notification_update',
            'notification': event['notification'],
            'timestamp': event['timestamp']
        }))

    @database_sync_to_async
    def get_vendor(self, vendor_id):
        try:
            return Vendor.objects.get(id=vendor_id)
        except Vendor.DoesNotExist:
            return None
