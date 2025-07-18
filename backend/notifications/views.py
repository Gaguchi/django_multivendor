from django.shortcuts import get_object_or_404
from django.http import Http404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from vendors.authentication import MasterTokenAuthentication
from vendors.models import Vendor
from django.utils import timezone
from django.db.models import Q
import logging

from .models import Notification, NotificationPreferences
from .serializers import (
    NotificationSerializer, NotificationPreferencesSerializer,
    NotificationBulkUpdateSerializer
)

logger = logging.getLogger(__name__)

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Get notifications for the current user/vendor"""
        # Check if this is a vendor request
        vendor = getattr(self.request, 'vendor', None)
        
        if vendor:
            # Return notifications for this vendor
            return Notification.objects.filter(
                vendor=vendor
            ).exclude(
                is_dismissed=True
            ).exclude(
                expires_at__lt=timezone.now()
            )
        else:
            # Return notifications for the authenticated user
            return Notification.objects.filter(
                recipient=self.request.user
            ).exclude(
                is_dismissed=True
            ).exclude(
                expires_at__lt=timezone.now()
            )
    
    def list(self, request, *args, **kwargs):
        """List notifications with filtering options"""
        queryset = self.get_queryset()
        
        # Filter by read status
        is_read = request.query_params.get('is_read')
        if is_read is not None:
            queryset = queryset.filter(is_read=is_read.lower() == 'true')
        
        # Filter by notification type
        notification_type = request.query_params.get('type')
        if notification_type:
            queryset = queryset.filter(notification_type=notification_type)
        
        # Filter by priority
        priority = request.query_params.get('priority')
        if priority:
            queryset = queryset.filter(priority=priority)
        
        # Limit results
        limit = request.query_params.get('limit')
        if limit:
            try:
                limit = int(limit)
                queryset = queryset[:limit]
            except ValueError:
                pass
        
        serializer = self.get_serializer(queryset, many=True)
        
        # Add summary statistics
        total_count = self.get_queryset().count()
        unread_count = self.get_queryset().filter(is_read=False).count()
        
        return Response({
            'results': serializer.data,
            'total_count': total_count,
            'unread_count': unread_count
        })
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark a notification as read"""
        notification = self.get_object()
        notification.mark_as_read()
        return Response({'status': 'Notification marked as read'})
    
    @action(detail=True, methods=['post'])
    def mark_unread(self, request, pk=None):
        """Mark a notification as unread"""
        notification = self.get_object()
        notification.is_read = False
        notification.read_at = None
        notification.save(update_fields=['is_read', 'read_at'])
        return Response({'status': 'Notification marked as unread'})
    
    @action(detail=True, methods=['post'])
    def dismiss(self, request, pk=None):
        """Dismiss a notification"""
        notification = self.get_object()
        notification.mark_as_dismissed()
        return Response({'status': 'Notification dismissed'})
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all notifications as read"""
        updated_count = self.get_queryset().filter(is_read=False).update(
            is_read=True,
            read_at=timezone.now()
        )
        return Response({
            'status': f'{updated_count} notifications marked as read'
        })
    
    @action(detail=False, methods=['post'])
    def bulk_update(self, request):
        """Bulk update notifications"""
        serializer = NotificationBulkUpdateSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            notification_ids = serializer.validated_data['notification_ids']
            action_type = serializer.validated_data['action']
            
            # Get notifications to update
            queryset = self.get_queryset().filter(id__in=notification_ids)
            
            if action_type == 'mark_read':
                updated_count = queryset.filter(is_read=False).update(
                    is_read=True,
                    read_at=timezone.now()
                )
            elif action_type == 'mark_unread':
                updated_count = queryset.update(
                    is_read=False,
                    read_at=None
                )
            elif action_type == 'dismiss':
                updated_count = queryset.filter(is_dismissed=False).update(
                    is_dismissed=True,
                    dismissed_at=timezone.now()
                )
            elif action_type == 'undismiss':
                updated_count = queryset.update(
                    is_dismissed=False,
                    dismissed_at=None
                )
            
            return Response({
                'status': f'{updated_count} notifications updated',
                'action': action_type
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Get count of unread notifications"""
        count = self.get_queryset().filter(is_read=False).count()
        return Response({'unread_count': count})
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get notification summary"""
        queryset = self.get_queryset()
        
        summary = {
            'total_count': queryset.count(),
            'unread_count': queryset.filter(is_read=False).count(),
            'high_priority_count': queryset.filter(priority='high').count(),
            'urgent_count': queryset.filter(priority='urgent').count(),
            'by_type': {}
        }
        
        # Count by notification type
        for notification_type, _ in Notification.NOTIFICATION_TYPES:
            count = queryset.filter(notification_type=notification_type).count()
            if count > 0:
                summary['by_type'][notification_type] = count
        
        return Response(summary)

class VendorNotificationViewSet(NotificationViewSet):
    """Vendor-specific notification endpoints"""
    authentication_classes = [MasterTokenAuthentication]
    permission_classes = []
    
    def get_queryset(self):
        """Get notifications for the vendor"""
        vendor = getattr(self.request, 'vendor', None)
        if not vendor:
            return Notification.objects.none()
        
        return Notification.objects.filter(
            vendor=vendor
        ).exclude(
            is_dismissed=True
        ).exclude(
            expires_at__lt=timezone.now()
        )

class NotificationPreferencesViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationPreferencesSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return NotificationPreferences.objects.filter(user=self.request.user)
    
    def get_object(self):
        """Get or create notification preferences"""
        vendor = getattr(self.request, 'vendor', None)
        preferences, created = NotificationPreferences.objects.get_or_create(
            user=self.request.user,
            vendor=vendor
        )
        return preferences
    
    @action(detail=False, methods=['get', 'post'])
    def my_preferences(self, request):
        """Get or update user's notification preferences"""
        if request.method == 'GET':
            preferences = self.get_object()
            serializer = self.get_serializer(preferences)
            return Response(serializer.data)
        
        elif request.method == 'POST':
            preferences = self.get_object()
            serializer = self.get_serializer(preferences, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VendorNotificationPreferencesViewSet(NotificationPreferencesViewSet):
    """Vendor-specific notification preferences"""
    authentication_classes = [MasterTokenAuthentication]
    permission_classes = []
    
    def get_object(self):
        """Get or create notification preferences for vendor"""
        vendor = getattr(self.request, 'vendor', None)
        if not vendor:
            raise Http404("Vendor not found")
        
        preferences, created = NotificationPreferences.objects.get_or_create(
            user=vendor.user,
            vendor=vendor
        )
        return preferences
