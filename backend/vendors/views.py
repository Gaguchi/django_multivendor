from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import serializers
import logging
from .models import Vendor, VendorProduct
from .serializers import VendorSerializer, ProductSerializer, ProductListSerializer
from users.models import UserProfile
from rest_framework_simplejwt.authentication import JWTAuthentication
from .authentication import MasterTokenAuthentication
from rest_framework.pagination import PageNumberPagination

logger = logging.getLogger(__name__)

class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    permission_classes = [IsAuthenticated]  # Only keep permission_classes, remove authentication_classes

    def initial(self, request, *args, **kwargs):
        """Log information before any other processing occurs"""
        logger.info("=== VendorViewSet Initial Processing ===")
        logger.info(f"Request Method: {request.method}")
        logger.info(f"Request User: {request.user}")
        logger.info(f"Request Auth: {request.auth}")
        logger.info(f"Request Headers: {request.headers}")
        return super().initial(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        logger.info("=== VendorViewSet Create Method ===")
        logger.info(f"Request Data: {request.data}")
        logger.info(f"=== Starting Vendor Creation ===")
        logger.info(f"User: {request.user}")
        logger.info(f"Auth: {request.auth}")
        logger.info(f"Headers: {request.headers}")
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        logger.info(f"Performing create for user: {self.request.user}")
        serializer.save(user=self.request.user)

    def get_permissions(self):
        """Log permission checks"""
        logger.info("=== Checking Permissions ===")
        perms = super().get_permissions()
        logger.info(f"Permission Classes: {perms}")
        return perms

    @action(detail=False, methods=['get'])
    def my_vendor(self, request):
        """Get the current user's vendor profile"""
        try:
            vendor = Vendor.objects.get(user=request.user)
            serializer = self.get_serializer(vendor)
            return Response(serializer.data)
        except Vendor.DoesNotExist:
            return Response(
                {"detail": "No vendor profile found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        """Get products for a specific vendor"""
        vendor = self.get_object()
        products = vendor.vendor_products.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

class ProductPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class ProductViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication, MasterTokenAuthentication]
    pagination_class = ProductPagination
    
    def get_permissions(self):
        """Allow read operations with master token, require authentication for others"""
        if self.action in ['list', 'retrieve']:
            permission_classes = []
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        return ProductSerializer

    def get_queryset(self):
        queryset = VendorProduct.objects.select_related('vendor', 'category').all()
        if self.action == 'list':
            # Optimize query for listings
            queryset = queryset.defer('description', 'video')
        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        """Set the vendor automatically based on the authenticated user"""
        try:
            vendor = Vendor.objects.get(user=self.request.user)
            serializer.save(vendor=vendor)
        except Vendor.DoesNotExist:
            raise serializers.ValidationError("Must be a vendor to create products")

    def perform_update(self, serializer):
        """Ensure users can only update their own products"""
        product = self.get_object()
        if product.vendor.user != self.request.user:
            raise serializers.ValidationError("Can only update your own products")
        serializer.save()

    def perform_destroy(self, instance):
        """Ensure users can only delete their own products"""
        if instance.vendor.user != self.request.user:
            raise serializers.ValidationError("Can only delete your own products")
        instance.delete()

    @action(detail=False, methods=['get'])
    def my_products(self, request):
        """Get all products for the authenticated vendor"""
        try:
            vendor = Vendor.objects.get(user=request.user)
            products = self.get_queryset().filter(vendor=vendor)
            serializer = self.get_serializer(products, many=True)
            return Response(serializer.data)
        except Vendor.DoesNotExist:
            return Response(
                {"detail": "Vendor profile not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
