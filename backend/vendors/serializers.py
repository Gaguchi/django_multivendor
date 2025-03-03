from rest_framework import serializers
from .models import Vendor, VendorProduct, ProductImage

# Import UserSerializer carefully to avoid circular import
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

class SimpleVendorSerializer(serializers.ModelSerializer):
    """Lightweight serializer for vendor information in product listings"""
    class Meta:
        model = Vendor
        fields = ['id', 'store_name']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'file', 'position']

class ProductSerializer(serializers.ModelSerializer):
    vendor = SimpleVendorSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True, source='product_images')
    category = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = VendorProduct
        fields = [
            'id',
            'name',
            'sku',
            'price',
            'old_price',
            'stock',
            'description',
            'thumbnail',
            'secondaryImage',
            'category',
            'vendor',
            'images',
            'rating',
            'is_hot',
            'created_at'
        ]
        read_only_fields = ['vendor', 'rating']

    def create(self, validated_data):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("Authentication required")
        
        product = VendorProduct.objects.create(**validated_data)
        return product

class ProductListSerializer(serializers.ModelSerializer):
    """Ultra lightweight serializer for product listings"""
    vendor_name = serializers.CharField(source='vendor.store_name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = VendorProduct
        fields = [
            'id',
            'name',
            'price',
            'old_price',
            'thumbnail',
            'category_name',
            'vendor_name',
            'rating',
            'is_hot'
        ]
