
from rest_framework import serializers
from .models import Review, ReviewImage, ReviewVideo
from vendors.models import VendorProduct
from orders.models import Order, OrderItem


class ReviewImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewImage
        fields = ['id', 'image', 'alt_text', 'created_at']


class ReviewVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewVideo
        fields = ['id', 'video', 'thumbnail', 'duration', 'created_at']


class ReviewSerializer(serializers.ModelSerializer):
    images = ReviewImageSerializer(many=True, read_only=True)
    videos = ReviewVideoSerializer(many=True, read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.SerializerMethodField()
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'id', 'product', 'user', 'order', 'rating', 'comment', 
            'created_at', 'updated_at', 'images', 'videos',
            'product_name', 'product_image', 'user_name'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']

    def get_product_image(self, obj):
        try:
            # Get the first image of the product (ordered by position)
            first_image = obj.product.product_images.first()
            if first_image and hasattr(first_image, 'file') and first_image.file:
                return first_image.file.url
            # Fallback to thumbnail if available
            if hasattr(obj.product, 'thumbnail') and obj.product.thumbnail:
                return obj.product.thumbnail.url
            return None
        except Exception as e:
            print(f"Error getting product image in ReviewSerializer: {e}")
            return None

    def validate(self, data):
        """Validate that user can review this product"""
        user = self.context['request'].user
        product = data.get('product')
        
        # Check if user has purchased and received this product
        if not OrderItem.objects.filter(
            order__user=user,
            product=product,
            order__status='Delivered'
        ).exists():
            raise serializers.ValidationError(
                "You can only review products from orders that have been delivered."
            )
        
        # Check if user already reviewed this product (for new reviews)
        if not self.instance and Review.objects.filter(user=user, product=product).exists():
            raise serializers.ValidationError(
                "You have already reviewed this product."
            )
        
        return data

    def create(self, validated_data):
        user = self.context['request'].user
        product = validated_data['product']
        
        # Get the most recent delivered order containing this product
        order_item = OrderItem.objects.filter(
            order__user=user,
            product=product,
            order__status='Delivered'
        ).order_by('-order__delivered_at').first()
        
        if order_item:
            validated_data['order'] = order_item.order
        
        return super().create(validated_data)


class ReviewableItemSerializer(serializers.Serializer):
    """Serializer for items that can be reviewed"""
    order_number = serializers.CharField()
    product = serializers.SerializerMethodField()
    delivered_at = serializers.DateTimeField()
    can_review = serializers.BooleanField()
    has_reviewed = serializers.BooleanField()

    def get_product(self, obj):
        return {
            'id': obj['product'].id,
            'name': obj['product'].name,
            'image': self.get_product_image(obj['product'])
        }

    def get_product_image(self, product):
        try:
            # Get the first image of the product (ordered by position)
            first_image = product.product_images.first()
            if first_image and hasattr(first_image, 'file') and first_image.file:
                return first_image.file.url
            # Fallback to thumbnail if available
            if hasattr(product, 'thumbnail') and product.thumbnail:
                return product.thumbnail.url
            return None
        except Exception as e:
            print(f"Error getting product image: {e}")
            return None