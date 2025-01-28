
from rest_framework import serializers
from .models import Shipment
from orders.models import Order

class ShipmentSerializer(serializers.ModelSerializer):
    order_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Shipment
        fields = [
            'id', 'order', 'order_id', 'tracking_number', 'carrier',
            'shipped_date', 'estimated_delivery_date', 'status',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['order', 'created_at', 'updated_at']

    def validate_order_id(self, value):
        try:
            Order.objects.get(id=value)
            return value
        except Order.DoesNotExist:
            raise serializers.ValidationError("Invalid order ID")

    def create(self, validated_data):
        order_id = validated_data.pop('order_id')
        order = Order.objects.get(id=order_id)
        return Shipment.objects.create(order=order, **validated_data)