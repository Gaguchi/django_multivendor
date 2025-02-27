from rest_framework import serializers
from .models import Order, OrderItem
from vendors.serializers import ProductSerializer  # Changed from VendorProductSerializer
from vendors.models import VendorProduct

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)  # Changed from VendorProductSerializer
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_id', 'quantity', 'unit_price', 'total_price']
        read_only_fields = ['unit_price', 'total_price']

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1")
        return value

    def validate_product_id(self, value):
        try:
            product = VendorProduct.objects.get(id=value)
            if product.stock < self.initial_data.get('quantity', 1):
                raise serializers.ValidationError("Not enough stock available")
            return value
        except VendorProduct.DoesNotExist:
            raise serializers.ValidationError("Invalid product")

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    order_items = serializers.ListField(
        child=serializers.DictField(
            child=serializers.IntegerField()
        ),
        write_only=True,
        required=False
    )

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'status', 'total_amount',
            'payment_method', 'shipping_address', 'billing_address',
            'created_at', 'updated_at', 'items', 'order_items'
        ]
        read_only_fields = ['order_number', 'total_amount', 'created_at', 'updated_at']

    def validate(self, data):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("Authentication required")

        # Validate order items if present
        order_items = data.get('order_items', [])
        if not order_items:
            raise serializers.ValidationError("At least one order item is required")

        # Validate addresses
        if not data.get('shipping_address'):
            raise serializers.ValidationError("Shipping address is required")
        if not data.get('billing_address'):
            raise serializers.ValidationError("Billing address is required")

        return data

    def validate_order_items(self, value):
        """Validate order items structure"""
        if not isinstance(value, list):
            raise serializers.ValidationError("Order items must be a list")
        
        for item in value:
            if not isinstance(item, dict):
                raise serializers.ValidationError("Each order item must be a dictionary")
            if 'product_id' not in item or 'quantity' not in item:
                raise serializers.ValidationError("Each order item must have product_id and quantity")
        return value

    def create(self, validated_data):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("Authentication required")
        
        order_items = validated_data.pop('order_items', [])
        if not order_items:
            raise serializers.ValidationError("At least one order item is required")

        validated_data['user'] = request.user
        order = super().create(validated_data)
        return order
