from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import Http404
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from vendors.models import VendorProduct
from django.utils import timezone

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    
    # Allow anonymous users to access cart endpoints
    def get_permissions(self):
        if self.action in ['current', 'add_item', 'remove_item']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Cart.objects.filter(user=self.request.user)
        return Cart.objects.none()

    def get_cart(self):
        """Get or create cart for current user or session"""
        user = self.request.user if self.request.user.is_authenticated else None
        session_key = self.request.session.session_key
        
        # For guest users, check for custom session key from headers (for CORS situations)
        if not user:
            guest_session_key = self.request.headers.get('X-Guest-Session-Key')
            print(f"[Cart] Guest session key from headers: {guest_session_key}")
            if guest_session_key:
                session_key = guest_session_key
                print(f"[Cart] Using guest session key: {session_key}")
            elif not session_key:
                # Fallback to Django session if no custom session key
                self.request.session.create()
                session_key = self.request.session.session_key
                print(f"[Cart] Created new Django session: {session_key}")
            
        print(f"[Cart] Getting cart for user: {user}, session_key: {session_key}")
        return Cart.get_or_create_cart(user=user, session_key=session_key)

    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get current user's or session's active cart"""
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
            
    @action(detail=False, methods=['post'])
    def merge_cart(self, request):
        """Merge guest cart with user cart after login"""
        if not request.user.is_authenticated:
            return Response(
                {"error": "User must be authenticated to merge carts"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        session_key = request.data.get('session_key')
        if not session_key:
            return Response(
                {"error": "Session key required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        print(f"[Cart Merge] Starting merge for user {request.user.id} with session {session_key}")
        
        # Get guest cart
        try:
            guest_cart = Cart.objects.get(session_key=session_key)
            guest_items_count = guest_cart.items.count()
            print(f"[Cart Merge] Found guest cart with {guest_items_count} items")
        except Cart.DoesNotExist:
            print(f"[Cart Merge] No guest cart found for session: {session_key}")
            # Return user's existing cart instead of error
            user_cart = Cart.get_or_create_cart(user=request.user)
            serializer = self.get_serializer(user_cart)
            return Response({
                **serializer.data,
                "merge_message": "No guest cart found to merge"
            }, status=status.HTTP_200_OK)
            
        # Get or create user cart
        user_cart = Cart.get_or_create_cart(user=request.user)
        user_items_before = user_cart.items.count()
        print(f"[Cart Merge] User cart has {user_items_before} items before merge")
        
        # Transfer items from guest cart to user cart
        merged_items = []
        items_added = 0
        items_merged = 0
        
        for item in guest_cart.items.all():
            user_cart_item, created = CartItem.objects.get_or_create(
                cart=user_cart,
                product=item.product,
                defaults={
                    'quantity': item.quantity,
                    'unit_price': item.unit_price,
                    'created_at': timezone.now(),
                    'updated_at': timezone.now()
                }
            )
            
            if not created:
                # If item already exists, add quantities
                old_quantity = user_cart_item.quantity
                user_cart_item.quantity += item.quantity
                user_cart_item.updated_at = timezone.now()
                user_cart_item.save()
                items_merged += 1
                print(f"[Cart Merge] Merged {item.product.name}: {old_quantity} + {item.quantity} = {user_cart_item.quantity}")
            else:
                items_added += 1
                print(f"[Cart Merge] Added {item.product.name}: quantity {item.quantity}")
            
            merged_items.append(user_cart_item)
        
        # Update user cart timestamp
        user_cart.updated_at = timezone.now()
        user_cart.save()
        
        # Delete the guest cart
        guest_cart.delete()
        user_items_after = user_cart.items.count()
        print(f"[Cart Merge] Deleted guest cart. User cart now has {user_items_after} items")
        print(f"[Cart Merge] Summary: {items_added} items added, {items_merged} items merged")
        
        # Return the updated user cart with merge summary
        serializer = self.get_serializer(user_cart)
        return Response({
            **serializer.data,
            "merge_summary": {
                "items_added": items_added,
                "items_merged": items_merged,
                "total_guest_items": guest_items_count,
                "user_items_before": user_items_before,
                "user_items_after": user_items_after
            }
        })

class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer

    def get_permissions(self):
        return [AllowAny()]

    def get_queryset(self):
        # For authenticated users, get items by user
        if self.request.user.is_authenticated:
            return CartItem.objects.filter(cart__user=self.request.user)
            
        # For guest users, get items by session key
        session_key = self.request.session.session_key
        
        # Check for custom session key from headers (for CORS situations)
        guest_session_key = self.request.headers.get('X-Guest-Session-Key')
        if guest_session_key:
            session_key = guest_session_key
        
        if session_key:
            return CartItem.objects.filter(cart__session_key=session_key)
            
        return CartItem.objects.none()

    def get_object(self):
        """Get cart item by product_id instead of item_id"""
        product_id = self.kwargs.get('pk')
        
        if self.request.user.is_authenticated:
            cart = Cart.get_or_create_cart(user=self.request.user)
        else:
            session_key = self.request.session.session_key
            
            # Check for custom session key from headers (for CORS situations)
            guest_session_key = self.request.headers.get('X-Guest-Session-Key')
            if guest_session_key:
                session_key = guest_session_key
            elif not session_key:
                self.request.session.create()
                session_key = self.request.session.session_key
                
            cart = Cart.get_or_create_cart(session_key=session_key)
        
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
