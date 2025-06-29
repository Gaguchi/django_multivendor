from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from vendors.authentication import MasterTokenAuthentication
from vendors.models import Vendor
from django.utils import timezone
import uuid
from .models import Order, OrderItem
from .serializers import (
    OrderSerializer, OrderItemSerializer, OrderTrackingSerializer,
    VendorOrderSerializer, VendorOrderStatusUpdateSerializer
)
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

    @action(detail=False, methods=['get'], 
            authentication_classes=[MasterTokenAuthentication],
            permission_classes=[],
            url_path='vendor')
    def vendor_orders(self, request):
        """
        Get orders for the authenticated vendor (using master token + vendor ID)
        """
        try:
            # Get vendor from request (set by MasterTokenAuthentication)
            vendor = getattr(request, 'vendor', None)
            if not vendor:
                return Response(
                    {'error': 'Vendor authentication required. Please provide X-Vendor-ID header.'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )

            # Get orders that contain items from this vendor
            orders = Order.objects.filter(
                items__product__vendor=vendor
            ).distinct().order_by('-created_at')

            # Apply filters
            status_filter = request.query_params.get('status')
            if status_filter:
                orders = orders.filter(status=status_filter)

            # Pagination
            limit = request.query_params.get('limit')
            if limit:
                try:
                    limit = int(limit)
                    orders = orders[:limit]
                except ValueError:
                    pass

            serializer = VendorOrderSerializer(
                orders, 
                many=True, 
                context={'vendor': vendor, 'request': request}
            )
            return Response(serializer.data)

        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['get'], 
            authentication_classes=[MasterTokenAuthentication],
            permission_classes=[],
            url_path='vendor-detail')
    def vendor_order_detail(self, request, order_number=None):
        """
        Get detailed order view for vendor
        """
        try:
            vendor = getattr(request, 'vendor', None)
            if not vendor:
                return Response(
                    {'error': 'Vendor authentication required. Please provide X-Vendor-ID header.'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )

            order = get_object_or_404(Order, order_number=order_number)
            
            if not order.can_vendor_access(vendor):
                return Response(
                    {'error': 'You do not have access to this order'}, 
                    status=status.HTTP_403_FORBIDDEN
                )

            serializer = VendorOrderSerializer(
                order, 
                context={'vendor': vendor, 'request': request}
            )
            return Response(serializer.data)

        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'], 
            authentication_classes=[MasterTokenAuthentication],
            permission_classes=[],
            url_path='update-status')
    def update_status(self, request, order_number=None):
        """
        Update order status by vendor
        """
        try:
            vendor = getattr(request, 'vendor', None)
            if not vendor:
                return Response(
                    {'error': 'Vendor authentication required. Please provide X-Vendor-ID header.'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )

            order = get_object_or_404(Order, order_number=order_number)
            
            serializer = VendorOrderStatusUpdateSerializer(
                data=request.data,
                context={'order': order, 'vendor': vendor}
            )
            
            if serializer.is_valid():
                new_status = serializer.validated_data['status']
                
                # Update order status based on vendor action
                if new_status == 'Shipped':
                    success = order.mark_as_shipped_by_vendor(vendor)
                elif new_status == 'Delivered':
                    success = order.mark_as_delivered_by_vendor(vendor)
                else:
                    return Response(
                        {'error': 'Invalid status update'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                if success:
                    return Response({
                        'status': 'Order status updated successfully',
                        'new_status': order.status
                    })
                else:
                    return Response(
                        {'error': 'Could not update order status'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
