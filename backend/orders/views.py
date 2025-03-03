from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
import uuid
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer, OrderTrackingSerializer
from vendors.models import VendorProduct

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'order_number'  # Use order_number instead of id for lookups
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    
    def retrieve(self, request, *args, **kwargs):
        """
        Override retrieve to support both ID-based and order_number-based lookups
        """
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        lookup_value = self.kwargs[lookup_url_kwarg]
        
        # Try to determine if lookup value is numeric (likely an ID)
        try:
            if lookup_value.isdigit():
                # This appears to be an ID lookup
                order = get_object_or_404(
                    Order.objects.filter(user=request.user),
                    id=lookup_value
                )
            else:
                # This appears to be an order_number lookup
                order = get_object_or_404(
                    Order.objects.filter(user=request.user),
                    order_number=lookup_value
                )
        except (ValueError, AttributeError):
            # Default to standard lookup behavior
            return super().retrieve(request, *args, **kwargs)
            
        serializer = self.get_serializer(order)
        return Response(serializer.data)

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
    def cancel(self, request, order_number=None):
        """
        Cancel an order by order number
        """
        order = self.get_object()
        if order.status == 'Pending':
            order.status = 'Cancelled'
            order.save()
            return Response({'status': 'Order cancelled'})
        return Response(
            {'error': 'Can only cancel pending orders'},
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=False, methods=['get'], permission_classes=[AllowAny], url_path='track/(?P<order_number>[^/.]+)')
    def track_order(self, request, order_number=None):
        """
        Track an order by its order number.
        This endpoint can be used by anyone with the order number,
        but returns limited information for non-owners.
        """
        try:
            order = Order.objects.get(order_number=order_number)
            
            # Check if the requester is the order owner
            is_owner = request.user.is_authenticated and order.user == request.user
            
            # Use a different serializer with limited data for non-owners
            if is_owner:
                serializer = OrderSerializer(order)
            else:
                serializer = OrderTrackingSerializer(order)
                
            return Response({
                'data': serializer.data,
                'is_owner': is_owner
            })
            
        except Order.DoesNotExist:
            return Response(
                {'detail': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
