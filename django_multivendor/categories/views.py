from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.utils import timezone
from .models import Category
from .serializers import CategorySerializer
import logging

logger = logging.getLogger(__name__)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'

    def get_permissions(self):
        """Require admin for all write operations"""
        if self.action in ['list', 'retrieve', 'root']:
            logger.info(f"Read-only action {self.action} - allowing public access")
            permission_classes = []
        else:
            logger.info(f"Write action {self.action} - requiring admin access")
            permission_classes = [IsAdminUser]
            # Log the requesting user
            if hasattr(self.request, 'user'):
                logger.info(f"User attempting action: {self.request.user} (is_staff: {self.request.user.is_staff})")
        return [permission() for permission in permission_classes]

    def check_object_permissions(self, request, obj):
        """Additional logging for object-level permissions"""
        super().check_object_permissions(request, obj)
        if request.method not in ['GET', 'HEAD', 'OPTIONS']:
            logger.info(f"User {request.user} attempting to modify category {obj.name}")

    @action(detail=False, methods=['get'])
    def root(self, request):
        """Get only root categories (those without parents)"""
        root_categories = Category.objects.filter(parent_category=None)
        serializer = self.get_serializer(root_categories, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(
            created_at=timezone.now(),
            updated_at=timezone.now()
        )

    def perform_update(self, serializer):
        serializer.save(updated_at=timezone.now())
