from rest_framework import serializers
from vendors.models import VendorProduct
from vendors.serializers import VendorSerializer

class ProductSerializer(serializers.ModelSerializer):
    vendor = VendorSerializer(read_only=True)

    class Meta:
        model = VendorProduct
        fields = [
            'id', 'vendor', 'name', 'sku', 
            'price', 'stock', 'description',
            'thumbnail', 'image', 'video'
        ]
        read_only_fields = ['vendor']

    def validate_price(self, value):
        """Ensure price is positive"""
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than zero")
        return value

    def validate_stock(self, value):
        """Ensure stock is non-negative"""
        if value < 0:
            raise serializers.ValidationError("Stock cannot be negative")
        return value
