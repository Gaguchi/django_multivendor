from rest_framework import viewsets
from .models import Vendor, VendorProduct
from .serializers import VendorSerializer, ProductSerializer

class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = VendorProduct.objects.all()
    serializer_class = ProductSerializer
