from rest_framework import serializers
from .models import Vendor, VendorProduct, ProductImage
from users.serializers import UserSerializer
from users.models import UserProfile

class VendorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # User will be set from the request

    class Meta:
        model = Vendor
        fields = [
            'id', 'user', 'store_name', 'description', 
            'contact_email', 'phone', 'address', 
            'logo', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']

    def validate(self, data):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("Authentication required")

        try:
            user_profile = UserProfile.objects.get(user=request.user)
            if user_profile.user_type != 'vendor':
                raise serializers.ValidationError("User must be a vendor type")
        except UserProfile.DoesNotExist:
            raise serializers.ValidationError("User profile not found")

        return data

    def create(self, validated_data):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("Authentication required")
        
        vendor = Vendor.objects.create(**validated_data)
        return vendor

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'file', 'position']

class ProductSerializer(serializers.ModelSerializer):
    vendor = VendorSerializer(read_only=True)  # Vendor will be set from the authenticated user
    images = ProductImageSerializer(many=True, read_only=True, source='product_images')

    class Meta:
        model = VendorProduct
        fields = [
            'id', 'vendor', 'name', 'sku', 'price', 'stock',
            'description', 'thumbnail', 'video', 'images'
        ]
        read_only_fields = ['vendor']

    def create(self, validated_data):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("Authentication required")
        
        product = VendorProduct.objects.create(**validated_data)
        return product
