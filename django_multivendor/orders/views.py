from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
import uuid
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer
from vendors.models import VendorProduct

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Generate unique order number
        order_number = str(uuid.uuid4().hex)[:10]
        
        # Create order
        order = serializer.save(
            user=self.request.user,
            order_number=order_number,
            created_at=timezone.now(),
            updated_at=timezone.now()
        )

        # Process order items
        order_items = self.request.data.get('order_items', [])
        total_amount = 0

        for item_data in order_items:
            try:
                product = VendorProduct.objects.get(id=item_data['product_id'])
                quantity = item_data['quantity']
                
                # Create order item
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=quantity,
                    unit_price=product.price,
                    total_price=product.price * quantity
                )
                
                total_amount += product.price * quantity
                
            except VendorProduct.DoesNotExist:
                continue

        # Update order total
        order.total_amount = total_amount
        order.save()

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        order = self.get_object()
        if order.status == 'Pending':
            order.status = 'Cancelled'
            order.save()
            return Response({'status': 'Order cancelled'})
        return Response(
            {'error': 'Can only cancel pending orders'},
            status=status.HTTP_400_BAD_REQUEST
        )
