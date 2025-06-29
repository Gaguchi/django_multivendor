from rest_framework import serializers
from .models import Order, OrderItem
from vendors.serializers import ProductSerializer  # Changed from VendorProductSerializer
from vendors.models import VendorProduct
from users.serializers import UserSerializer

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

class VendorOrderItemSerializer(serializers.ModelSerializer):
    """Serializer for order items from vendor perspective"""
    product = ProductSerializer(read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'unit_price', 'total_price']

class VendorOrderSerializer(serializers.ModelSerializer):
    """Serializer for orders from vendor perspective - limited customer info"""
    items = VendorOrderItemSerializer(many=True, read_only=True)
    vendor_items = serializers.SerializerMethodField()
    vendor_total = serializers.SerializerMethodField()
    customer_name = serializers.SerializerMethodField()
    customer_email = serializers.SerializerMethodField()
    can_update_status = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'status', 'total_amount', 'vendor_total',
            'customer_name', 'customer_email', 'shipping_address', 
            'created_at', 'updated_at', 'delivered_at', 'items', 'vendor_items',
            'can_update_status'
        ]
        read_only_fields = ['order_number', 'total_amount', 'created_at', 'updated_at']
    
    def get_vendor_items(self, obj):
        """Get only items that belong to the current vendor"""
        vendor = self.context.get('vendor')
        if vendor:
            vendor_items = obj.get_vendor_items(vendor)
            return VendorOrderItemSerializer(vendor_items, many=True).data
        return []
    
    def get_vendor_total(self, obj):
        """Get total for vendor's items only"""
        vendor = self.context.get('vendor')
        if vendor:
            return float(obj.get_vendor_total(vendor))
        return 0.0
    
    def get_customer_name(self, obj):
        """Get customer name (limited info for privacy)"""
        user = obj.user
        if user.first_name and user.last_name:
            return f"{user.first_name} {user.last_name}"
        elif hasattr(user, 'profile') and user.profile.first_name:
            return f"{user.profile.first_name} {user.profile.last_name or ''}".strip()
        return user.username
    
    def get_customer_email(self, obj):
        """Get customer email (first 3 chars + masked)"""
        email = obj.user.email
        if len(email) > 3:
            at_index = email.find('@')
            if at_index > 3:
                return email[:3] + '*' * (at_index - 3) + email[at_index:]
            else:
                return email[:3] + '***@' + email.split('@')[1]
        return email
    
    def get_can_update_status(self, obj):
        """Check if vendor can update order status"""
        vendor = self.context.get('vendor')
        if not vendor or not obj.can_vendor_access(vendor):
            return False
        
        # Vendors can update from Paid to Shipped, or Shipped to Delivered
        return obj.status in ['Paid', 'Shipped']

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

class OrderTrackingSerializer(serializers.ModelSerializer):
    """A serializer that provides limited tracking information for any user"""
    item_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = [
            'order_number', 'status', 'created_at', 'item_count',
            'updated_at', 'shipping_address', 'delivered_at'
        ]
    
    def get_item_count(self, obj):
        return obj.items.count()

class VendorOrderStatusUpdateSerializer(serializers.Serializer):
    """Serializer for vendor order status updates"""
    status = serializers.ChoiceField(choices=['Shipped', 'Delivered'])
    
    def validate_status(self, value):
        order = self.context.get('order')
        vendor = self.context.get('vendor')
        
        if not order or not vendor:
            raise serializers.ValidationError("Invalid order or vendor context")
        
        if not order.can_vendor_access(vendor):
            raise serializers.ValidationError("You don't have access to this order")
        
        # Validate status transitions
        if value == 'Shipped' and order.status != 'Paid':
            raise serializers.ValidationError("Order must be paid before marking as shipped")
        elif value == 'Delivered' and order.status != 'Shipped':
            raise serializers.ValidationError("Order must be shipped before marking as delivered")
        
        return value
