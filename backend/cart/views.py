from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from vendors.models import VendorProduct
from django.utils import timezone

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    def get_cart(self):
        """Get or create cart for current user"""
        return Cart.get_or_create_cart(user=self.request.user)

    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get current user's active cart"""
        cart = self.get_cart()
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """Add item to current cart"""
        cart = self.get_cart()
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        try:
            product = VendorProduct.objects.get(id=product_id)
            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product=product,
                defaults={
                    'quantity': quantity, 
                    'unit_price': product.price,
                    'created_at': timezone.now(),
                    'updated_at': timezone.now()
                }
            )
            
            if not created:
                cart_item.quantity += quantity
                cart_item.updated_at = timezone.now()
                cart_item.save()

            cart.updated_at = timezone.now()
            cart.save()

            return Response(CartItemSerializer(cart_item).data)
            
        except VendorProduct.DoesNotExist:
            return Response(
                {"error": "Product not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        """Remove item from current cart using product_id"""
        cart = self.get_cart()
        product_id = request.data.get('product_id')

        try:
            item = cart.items.get(product_id=product_id)
            item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CartItem.DoesNotExist:
            return Response(
                {"error": "Product not found in cart"}, 
                status=status.HTTP_404_NOT_FOUND
            )

class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user)

    def get_object(self):
        """Get cart item by product_id instead of item_id"""
        product_id = self.kwargs.get('pk')
        cart = Cart.get_or_create_cart(user=self.request.user)
        
        try:
            return CartItem.objects.get(
                cart=cart,
                product_id=product_id
            )
        except CartItem.DoesNotExist:
            raise Http404("Product not found in cart")

    def update(self, request, *args, **kwargs):
        """Update item quantity"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Validate quantity
        quantity = request.data.get('quantity', instance.quantity)
        if quantity < 1:
            return Response(
                {"error": "Quantity must be at least 1"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        serializer = self.get_serializer(instance, data={'quantity': quantity}, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()
        cart = serializer.instance.cart
        cart.updated_at = timezone.now()
        cart.save()
