from rest_framework import serializers
from .models import Payment
from orders.serializers import OrderSerializer

class PaymentSerializer(serializers.ModelSerializer):
    order = OrderSerializer(read_only=True)
    order_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'order', 'order_id', 'amount', 
            'provider', 'transaction_id', 'status', 
            'created_at'
        ]
        read_only_fields = ['transaction_id', 'created_at']

    def validate_order_id(self, value):
        from orders.models import Order
        from .models import Payment
        try:
            order = Order.objects.get(id=value)
            if Payment.objects.filter(order=order).exists():
                raise serializers.ValidationError("Payment already exists for this order")
            return value
        except Order.DoesNotExist:
            raise serializers.ValidationError("Invalid order ID")
