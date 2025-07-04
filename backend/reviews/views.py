from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from .models import Review, ReviewImage, ReviewVideo
from .serializers import ReviewSerializer, ReviewableItemSerializer
from orders.models import Order, OrderItem
from vendors.models import VendorProduct


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users see their own reviews or all reviews if staff
        if self.request.user.is_staff:
            return Review.objects.all().select_related('product', 'user').prefetch_related('images', 'videos')
        return Review.objects.filter(user=self.request.user).select_related('product', 'user').prefetch_related('images', 'videos')

    def perform_create(self, serializer):
        review = serializer.save(user=self.request.user)
        self._handle_file_uploads(review)

    def perform_update(self, serializer):
        review = serializer.save()
        self._handle_file_uploads(review)

    def _handle_file_uploads(self, review):
        """Handle image and video uploads"""
        request = self.request
        
        # Handle images
        images = request.FILES.getlist('images')
        for image in images:
            ReviewImage.objects.create(
                review=review,
                image=image,
                alt_text=f"Review image for {review.product.name}"
            )
        
        # Handle videos
        videos = request.FILES.getlist('videos')
        for video in videos:
            ReviewVideo.objects.create(
                review=review,
                video=video
            )

    @action(detail=False, methods=['get'])
    def reviewable_items(self, request):
        """Get items that can be reviewed by the current user"""
        try:
            user = request.user
            print(f"[DEBUG] User requesting reviewable items: {user.username} (ID: {user.id})")
            
            # Get all delivered order items for the user
            delivered_items = OrderItem.objects.filter(
                order__user=user,
                order__status='Delivered'
            ).select_related('product', 'order').order_by('-order__delivered_at')
            
            print(f"[DEBUG] Found {delivered_items.count()} delivered items for user")
            
            reviewable_items = []
            seen_products = set()
            
            for item in delivered_items:
                print(f"[DEBUG] Processing item: {item.product.name} from order {item.order.order_number}")
                # Only include each product once (most recent delivery)
                if item.product.id in seen_products:
                    continue
                seen_products.add(item.product.id)
                
                # Check if user has already reviewed this product
                has_reviewed = Review.objects.filter(
                    user=user,
                    product=item.product
                ).exists()
                
                reviewable_items.append({
                    'order_number': item.order.order_number,
                    'product': item.product,
                    'delivered_at': item.order.delivered_at,
                    'can_review': not has_reviewed,
                    'has_reviewed': has_reviewed
                })
            
            # Filter to only items that can be reviewed (haven't been reviewed yet)
            if request.query_params.get('can_review_only') == 'true':
                reviewable_items = [item for item in reviewable_items if item['can_review']]
            
            print(f"[DEBUG] Returning {len(reviewable_items)} reviewable items")
            serializer = ReviewableItemSerializer(reviewable_items, many=True)
            return Response(serializer.data)
            
        except Exception as e:
            print(f"[ERROR] Error in reviewable_items: {str(e)}")
            return Response({'error': 'Failed to get reviewable items'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], url_path='can-review/(?P<product_id>[^/.]+)')
    def can_review(self, request, product_id=None):
        """Check if user can review a specific product"""
        user = request.user
        
        try:
            product = VendorProduct.objects.get(id=product_id)
        except VendorProduct.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if user has purchased and received this product
        has_purchased = OrderItem.objects.filter(
            order__user=user,
            product=product,
            order__status='Delivered'
        ).exists()
        
        # Check if user has already reviewed this product
        has_reviewed = Review.objects.filter(user=user, product=product).exists()
        
        return Response({
            'can_review': has_purchased and not has_reviewed,
            'has_purchased': has_purchased,
            'has_reviewed': has_reviewed
        })

    @action(detail=False, methods=['get'], url_path='has-reviewed/(?P<product_id>[^/.]+)')
    def has_reviewed(self, request, product_id=None):
        """Check if user has already reviewed a specific product"""
        user = request.user
        
        try:
            product = VendorProduct.objects.get(id=product_id)
        except VendorProduct.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        
        has_reviewed = Review.objects.filter(user=user, product=product).exists()
        
        return Response({'has_reviewed': has_reviewed})

    @action(detail=False, methods=['get'])
    def product_reviews(self, request):
        """Get all reviews for a specific product"""
        product_id = request.query_params.get('product_id')
        if not product_id:
            return Response({'error': 'product_id parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            product = VendorProduct.objects.get(id=product_id)
        except VendorProduct.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        
        reviews = Review.objects.filter(product=product).select_related('user').prefetch_related('images', 'videos')
        serializer = self.get_serializer(reviews, many=True)
        
        return Response({
            'results': serializer.data,
            'average_rating': self._calculate_average_rating(reviews),
            'total_reviews': reviews.count()
        })

    def _calculate_average_rating(self, reviews):
        """Calculate average rating for reviews"""
        if not reviews:
            return 0
        
        total_rating = sum(review.rating for review in reviews)
        return round(total_rating / len(reviews), 1)
