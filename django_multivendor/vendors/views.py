from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
import logging
from .models import Vendor, VendorProduct
from .serializers import VendorSerializer, ProductSerializer
from users.models import UserProfile

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

class ProductViewSet(viewsets.ModelViewSet):
    queryset = VendorProduct.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]  # Only keep permission_classes, remove authentication_classes
