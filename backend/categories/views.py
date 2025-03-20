from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.utils import timezone
from .models import Category, AttributeGroup, Attribute, AttributeOption
from .serializers import (
    CategorySerializer, CategoryDetailSerializer, 
    AttributeGroupSerializer, AttributeSerializer, AttributeOptionSerializer
)
import logging

logger = logging.getLogger(__name__)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'

    def get_permissions(self):
        """Require admin for all write operations"""
        if self.action in ['list', 'retrieve', 'root', 'detail']:
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
    
    @action(detail=True, methods=['get'])
    def detail(self, request, slug=None):
        """Get detailed category view with attribute groups"""
        category = self.get_object()
        serializer = CategoryDetailSerializer(category)
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(
            created_at=timezone.now(),
            updated_at=timezone.now()
        )

    def perform_update(self, serializer):
        serializer.save(updated_at=timezone.now())


class AttributeGroupViewSet(viewsets.ModelViewSet):
    queryset = AttributeGroup.objects.all()
    serializer_class = AttributeGroupSerializer
    permission_classes = [IsAdminUser]
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Get attribute groups for a specific category"""
        category_id = request.query_params.get('category_id')
        if not category_id:
            return Response(
                {"error": "category_id query parameter is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        groups = AttributeGroup.objects.filter(categories__id=category_id)
        serializer = self.get_serializer(groups, many=True)
        return Response(serializer.data)


class AttributeViewSet(viewsets.ModelViewSet):
    queryset = Attribute.objects.all()
    serializer_class = AttributeSerializer
    permission_classes = [IsAdminUser]
    
    @action(detail=False, methods=['get'])
    def by_group(self, request):
        """Get attributes for a specific group"""
        group_id = request.query_params.get('group_id')
        if not group_id:
            return Response(
                {"error": "group_id query parameter is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        attributes = Attribute.objects.filter(group_id=group_id)
        serializer = self.get_serializer(attributes, many=True)
        return Response(serializer.data)


class AttributeOptionViewSet(viewsets.ModelViewSet):
    queryset = AttributeOption.objects.all()
    serializer_class = AttributeOptionSerializer
    permission_classes = [IsAdminUser]
    
    @action(detail=False, methods=['get'])
    def by_attribute(self, request):
        """Get options for a specific attribute"""
        attribute_id = request.query_params.get('attribute_id')
        if not attribute_id:
            return Response(
                {"error": "attribute_id query parameter is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        options = AttributeOption.objects.filter(attribute_id=attribute_id)
        serializer = self.get_serializer(options, many=True)
        return Response(serializer.data)
