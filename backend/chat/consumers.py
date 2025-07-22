import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User
from vendors.models import Vendor
from .models import ChatRoom, ChatMessage, ChatParticipant
from django.utils import timezone
from asgiref.sync import sync_to_async

logger = logging.getLogger(__name__)


class ChatConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.room_id = None
        self.room_group_name = None
        self.user = None
        self.vendor = None
        self.participant_type = None
        self.chat_room = None

    async def connect(self):
        # Extract room_id from URL route
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'
        
        # Get user from scope (set by auth middleware)
        self.user = self.scope.get('user')
        
        if not self.user or not self.user.is_authenticated:
            await self.close()
            return
        
        try:
            # Get chat room and determine participant type
            self.chat_room = await self.get_chat_room(self.room_id)
            if not self.chat_room:
                await self.close()
                return
            
            # Determine if user is customer or vendor
            if self.chat_room.customer == self.user:
                self.participant_type = 'customer'
            else:
                # Check if user is associated with the vendor
                vendor = await self.get_vendor_for_user(self.user)
                if vendor and vendor == self.chat_room.vendor:
                    self.participant_type = 'vendor'
                    self.vendor = vendor
                else:
                    await self.close()
                    return
            
            # Join room group
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            
            await self.accept()
            
            # Update participant status
            await self.update_participant_status(is_online=True)
            
            # Notify others about user joining
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_status',
                    'user_type': self.participant_type,
                    'user_id': self.user.id,
                    'status': 'online',
                    'timestamp': timezone.now().isoformat()
                }
            )
            
            logger.info(f"User {self.user.username} connected to chat room {self.room_id}")
            
        except Exception as e:
            logger.error(f"Error in chat connect: {e}")
            await self.close()

    async def disconnect(self, close_code):
        if self.room_group_name:
            # Update participant status
            await self.update_participant_status(is_online=False, is_typing=False)
            
            # Notify others about user leaving
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_status',
                    'user_type': self.participant_type,
                    'user_id': self.user.id if self.user else None,
                    'status': 'offline',
                    'timestamp': timezone.now().isoformat()
                }
            )
            
            # Leave room group
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
        
        logger.info(f"User disconnected from chat room {self.room_id}")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'chat_message':
                await self.handle_chat_message(data)
            elif message_type == 'typing_start':
                await self.handle_typing_start()
            elif message_type == 'typing_stop':
                await self.handle_typing_stop()
            elif message_type == 'mark_read':
                await self.handle_mark_read()
            elif message_type == 'ping':
                await self.send(text_data=json.dumps({
                    'type': 'pong',
                    'timestamp': timezone.now().isoformat()
                }))
            else:
                logger.warning(f"Unknown message type: {message_type}")
                
        except json.JSONDecodeError:
            logger.error(f"Invalid JSON received: {text_data}")
        except Exception as e:
            logger.error(f"Error handling message: {e}")

    async def handle_chat_message(self, data):
        content = data.get('content', '').strip()
        if not content:
            return
        
        # Save message to database
        message = await self.save_message(content)
        if not message:
            return
        
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message_id': message.id,
                'content': content,
                'sender_type': self.participant_type,
                'sender_id': self.user.id,
                'sender_name': await self.get_sender_name(),
                'timestamp': message.timestamp.isoformat(),
                'chat_room_id': self.chat_room.id
            }
        )

    async def handle_typing_start(self):
        await self.update_participant_status(is_typing=True)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'typing_status',
                'user_type': self.participant_type,
                'user_id': self.user.id,
                'is_typing': True,
                'timestamp': timezone.now().isoformat()
            }
        )

    async def handle_typing_stop(self):
        await self.update_participant_status(is_typing=False)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'typing_status',
                'user_type': self.participant_type,
                'user_id': self.user.id,
                'is_typing': False,
                'timestamp': timezone.now().isoformat()
            }
        )

    async def handle_mark_read(self):
        """Mark messages as read by current user"""
        await self.mark_messages_read()
        
        # Notify others that messages were read
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'messages_read',
                'reader_type': self.participant_type,
                'reader_id': self.user.id,
                'timestamp': timezone.now().isoformat()
            }
        )

    # Group message handlers
    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message_id': event['message_id'],
            'content': event['content'],
            'sender_type': event['sender_type'],
            'sender_id': event['sender_id'],
            'sender_name': event['sender_name'],
            'timestamp': event['timestamp'],
            'chat_room_id': event['chat_room_id']
        }))

    async def typing_status(self, event):
        # Don't send typing status to the sender
        if event['user_id'] != self.user.id:
            await self.send(text_data=json.dumps({
                'type': 'typing_status',
                'user_type': event['user_type'],
                'user_id': event['user_id'],
                'is_typing': event['is_typing'],
                'timestamp': event['timestamp']
            }))

    async def user_status(self, event):
        # Don't send status to the user themselves
        if event['user_id'] != self.user.id:
            await self.send(text_data=json.dumps({
                'type': 'user_status',
                'user_type': event['user_type'],
                'user_id': event['user_id'],
                'status': event['status'],
                'timestamp': event['timestamp']
            }))

    async def messages_read(self, event):
        # Don't send read status to the reader themselves
        if event['reader_id'] != self.user.id:
            await self.send(text_data=json.dumps({
                'type': 'messages_read',
                'reader_type': event['reader_type'],
                'reader_id': event['reader_id'],
                'timestamp': event['timestamp']
            }))

    # Database operations
    @database_sync_to_async
    def get_chat_room(self, room_id):
        try:
            return ChatRoom.objects.select_related('customer', 'vendor').get(id=room_id)
        except ChatRoom.DoesNotExist:
            return None

    @database_sync_to_async
    def get_vendor_for_user(self, user):
        try:
            return Vendor.objects.get(user=user)
        except Vendor.DoesNotExist:
            return None

    @database_sync_to_async
    def save_message(self, content):
        try:
            message = ChatMessage.objects.create(
                chat_room=self.chat_room,
                sender_type=self.participant_type,
                sender_user=self.user if self.participant_type == 'customer' else None,
                sender_vendor=self.vendor if self.participant_type == 'vendor' else None,
                content=content,
                message_type='text'
            )
            return message
        except Exception as e:
            logger.error(f"Error saving message: {e}")
            return None

    @database_sync_to_async
    def get_sender_name(self):
        if self.participant_type == 'customer':
            return f"{self.user.first_name} {self.user.last_name}".strip() or self.user.username
        else:
            return self.vendor.business_name if self.vendor else self.user.username

    @database_sync_to_async
    def update_participant_status(self, is_online=None, is_typing=None):
        try:
            participant, created = ChatParticipant.objects.get_or_create(
                chat_room=self.chat_room,
                user=self.user if self.participant_type == 'customer' else None,
                vendor=self.vendor if self.participant_type == 'vendor' else None,
                participant_type=self.participant_type,
                defaults={
                    'is_online': is_online if is_online is not None else False,
                    'is_typing': is_typing if is_typing is not None else False,
                }
            )
            
            update_fields = []
            if is_online is not None:
                participant.is_online = is_online
                update_fields.append('is_online')
            
            if is_typing is not None:
                participant.is_typing = is_typing
                if is_typing:
                    participant.typing_timestamp = timezone.now()
                    update_fields.extend(['is_typing', 'typing_timestamp'])
                else:
                    update_fields.append('is_typing')
            
            if update_fields:
                participant.save(update_fields=update_fields)
                
        except Exception as e:
            logger.error(f"Error updating participant status: {e}")

    @database_sync_to_async
    def mark_messages_read(self):
        try:
            if self.participant_type == 'customer':
                self.chat_room.mark_read_by_customer()
            else:
                self.chat_room.mark_read_by_vendor()
        except Exception as e:
            logger.error(f"Error marking messages as read: {e}")
