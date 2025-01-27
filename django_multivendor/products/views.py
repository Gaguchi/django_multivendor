from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import serializers
import logging
from .serializers import ProductSerializer
from vendors.models import Vendor, VendorProduct

logger = logging.getLogger(__name__)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = VendorProduct.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        """Create a new product for the vendor"""
        try:
            # Get the vendor associated with the current user
            vendor = Vendor.objects.get(user=self.request.user)
            logger.info(f"Creating product for vendor: {vendor}")
            serializer.save(vendor=vendor)
        except Vendor.DoesNotExist:
            logger.error(f"No vendor profile found for user: {self.request.user}")
            raise serializers.ValidationError("User must be a vendor to create products")

    def get_queryset(self):
        """Filter products by vendor if user is a vendor"""
        if hasattr(self.request.user, 'vendor'):
            return VendorProduct.objects.filter(vendor=self.request.user.vendor)
        return VendorProduct.objects.all()

# Create your views here.
