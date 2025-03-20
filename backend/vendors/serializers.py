from rest_framework import serializers
from .models import Vendor, VendorProduct, ProductImage

# Import UserSerializer carefully to avoid circular import
from users.serializers import UserSerializer 
from users.models import UserProfile

# Add these imports
from categories.models import Attribute, AttributeGroup
from .models import ProductAttributeValue

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

class ProductAttributeValueSerializer(serializers.ModelSerializer):
    attribute_name = serializers.CharField(source='attribute.name', read_only=True)
    attribute_group = serializers.CharField(source='attribute.group.name', read_only=True)
    attribute_type = serializers.CharField(source='attribute.attribute_type', read_only=True)
    display_value = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductAttributeValue
        fields = [
            'id', 'attribute', 'attribute_name', 'attribute_group', 
            'attribute_type', 'text_value', 'number_value', 
            'boolean_value', 'option_values', 'display_value'
        ]
    
    def get_display_value(self, obj):
        return obj.get_value()

class ProductSerializer(serializers.ModelSerializer):
    vendor = SimpleVendorSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True, source='product_images')
    category = serializers.CharField(source='category.name', read_only=True)
    attribute_values = ProductAttributeValueSerializer(many=True, read_only=True)
    attribute_groups = serializers.SerializerMethodField()

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
            'created_at',
            'attribute_values',
            'attribute_groups'
        ]
        read_only_fields = ['vendor', 'rating']

    def get_attribute_groups(self, obj):
        """
        Group attribute values by their attribute groups for easy display
        """
        if not hasattr(obj, 'attribute_values'):
            return []
        
        # Get all attribute values for this product
        values = obj.attribute_values.all()
        if not values:
            return []
            
        # Get all groups used by this product's attributes
        groups = AttributeGroup.objects.filter(
            attributes__product_values__product=obj
        ).distinct().order_by('display_order')
        
        result = []
        for group in groups:
            group_data = {
                'id': group.id,
                'name': group.name,
                'attributes': []
            }
            
            # Get attributes for this group that have values for this product
            attributes = Attribute.objects.filter(
                group=group,
                product_values__product=obj
            ).order_by('display_order')
            
            for attribute in attributes:
                try:
                    value = ProductAttributeValue.objects.get(
                        product=obj,
                        attribute=attribute
                    )
                    
                    group_data['attributes'].append({
                        'id': attribute.id,
                        'name': attribute.name,
                        'value': value.get_value(),
                        'has_tooltip': attribute.has_tooltip,
                        'tooltip_text': attribute.tooltip_text,
                    })
                except ProductAttributeValue.DoesNotExist:
                    pass
                    
            if group_data['attributes']:
                result.append(group_data)
                
        return result

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
