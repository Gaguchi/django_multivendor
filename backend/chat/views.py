from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Prefetch, Sum
from django.contrib.auth.models import User
from vendors.models import Vendor
from .models import ChatRoom, ChatMessage, ChatParticipant
from .serializers import ChatRoomSerializer, ChatMessageSerializer, ChatParticipantSerializer
from django.utils import timezone
from django.db.models import Max


class ChatRoomViewSet(viewsets.ModelViewSet):
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        # Get queryset based on user type
        try:
            vendor = Vendor.objects.get(user=user)
            # User is a vendor
            queryset = ChatRoom.objects.filter(vendor=vendor)
        except Vendor.DoesNotExist:
            # User is a customer
            queryset = ChatRoom.objects.filter(customer=user)
        
        return queryset.select_related('customer', 'vendor').prefetch_related(
            Prefetch(
                'messages',
                queryset=ChatMessage.objects.order_by('-timestamp')[:1],
                to_attr='latest_message'
            )
        ).order_by('-updated_at')
    
    def create(self, request):
        """Create or get existing chat room between customer and vendor"""
        vendor_id = request.data.get('vendor_id')
        if not vendor_id:
            return Response(
                {'error': 'vendor_id is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            vendor = Vendor.objects.get(id=vendor_id)
        except Vendor.DoesNotExist:
            return Response(
                {'error': 'Vendor not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if user is trying to chat with themselves (if they're a vendor)
        try:
            user_vendor = Vendor.objects.get(user=request.user)
            if user_vendor == vendor:
                return Response(
                    {'error': 'Cannot create chat with yourself'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Vendor.DoesNotExist:
            pass  # User is a customer, which is fine
        
        # Get or create chat room
        chat_room, created = ChatRoom.objects.get_or_create(
            customer=request.user,
            vendor=vendor,
            defaults={'is_active': True}
        )
        
        serializer = self.get_serializer(chat_room)
        return Response(
            serializer.data, 
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark all messages in chat room as read by current user"""
        chat_room = self.get_object()
        
        try:
            vendor = Vendor.objects.get(user=request.user)
            # User is a vendor
            chat_room.mark_read_by_vendor()
        except Vendor.DoesNotExist:
            # User is a customer
            chat_room.mark_read_by_customer()
        
        return Response({'status': 'messages marked as read'})
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Get total unread message count for current user"""
        user = request.user
        total_unread = 0
        
        try:
            vendor = Vendor.objects.get(user=user)
            # User is a vendor
            total_unread = ChatRoom.objects.filter(
                vendor=vendor
            ).aggregate(
                total=Sum('unread_by_vendor')
            )['total'] or 0
        except Vendor.DoesNotExist:
            # User is a customer
            total_unread = ChatRoom.objects.filter(
                customer=user
            ).aggregate(
                total=Sum('unread_by_customer')
            )['total'] or 0
        
        return Response({'unread_count': total_unread})


class ChatMessageViewSet(viewsets.ModelViewSet):
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        chat_room_id = self.request.query_params.get('chat_room')
        if not chat_room_id:
            return ChatMessage.objects.none()
        
        # Verify user has access to this chat room
        user = self.request.user
        try:
            vendor = Vendor.objects.get(user=user)
            chat_room = ChatRoom.objects.get(id=chat_room_id, vendor=vendor)
        except (Vendor.DoesNotExist, ChatRoom.DoesNotExist):
            try:
                chat_room = ChatRoom.objects.get(id=chat_room_id, customer=user)
            except ChatRoom.DoesNotExist:
                return ChatMessage.objects.none()
        
        return ChatMessage.objects.filter(
            chat_room=chat_room
        ).select_related(
            'sender_user', 'sender_vendor'
        ).order_by('timestamp')
    
    def create(self, request):
        """Create a new chat message"""
        chat_room_id = request.data.get('chat_room')
        content = request.data.get('content', '').strip()
        
        if not chat_room_id or not content:
            return Response(
                {'error': 'chat_room and content are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verify user has access to this chat room
        user = request.user
        try:
            vendor = Vendor.objects.get(user=user)
            chat_room = ChatRoom.objects.get(id=chat_room_id, vendor=vendor)
            sender_type = 'vendor'
            sender_vendor = vendor
            sender_user = None
        except (Vendor.DoesNotExist, ChatRoom.DoesNotExist):
            try:
                chat_room = ChatRoom.objects.get(id=chat_room_id, customer=user)
                sender_type = 'customer'
                sender_vendor = None
                sender_user = user
            except ChatRoom.DoesNotExist:
                return Response(
                    {'error': 'Chat room not found or access denied'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        
        # Create message
        message = ChatMessage.objects.create(
            chat_room=chat_room,
            sender_type=sender_type,
            sender_user=sender_user,
            sender_vendor=sender_vendor,
            content=content,
            message_type='text'
        )
        
        serializer = self.get_serializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ChatParticipantViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ChatParticipantSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        chat_room_id = self.request.query_params.get('chat_room')
        if not chat_room_id:
            return ChatParticipant.objects.none()
        
        # Verify user has access to this chat room
        user = self.request.user
        try:
            vendor = Vendor.objects.get(user=user)
            chat_room = ChatRoom.objects.get(id=chat_room_id, vendor=vendor)
        except (Vendor.DoesNotExist, ChatRoom.DoesNotExist):
            try:
                chat_room = ChatRoom.objects.get(id=chat_room_id, customer=user)
            except ChatRoom.DoesNotExist:
                return ChatParticipant.objects.none()
        
        return ChatParticipant.objects.filter(
            chat_room=chat_room
        ).select_related('user', 'vendor')
    
    @action(detail=False, methods=['get'])
    def online_status(self, request):
        """Get online status of participants in a chat room"""
        chat_room_id = request.query_params.get('chat_room')
        if not chat_room_id:
            return Response({'error': 'chat_room parameter required'}, status=400)
        
        participants = self.get_queryset().filter(is_online=True)
        serializer = self.get_serializer(participants, many=True)
        return Response(serializer.data)
