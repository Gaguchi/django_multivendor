from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import Review, ReviewMedia
from .serializers import ReviewSerializer, ReviewMediaSerializer
from vendors.models import VendorProduct
import logging

# Set up logger
logger = logging.getLogger(__name__)

class ReviewViewSet(viewsets.ModelViewSet):
    """ViewSet for product reviews with media support"""
    serializer_class = ReviewSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    permission_classes = [IsAuthenticatedOrReadOnly]  # Allow read-only access for unauthenticated users
    
    def get_queryset(self):
        """Filter reviews based on query parameters"""
        queryset = Review.objects.all().select_related('user').prefetch_related('media')
        
        # Filter by product
        product_id = self.request.query_params.get('product')
        if product_id:
            try:
                product_id = int(product_id)
                queryset = queryset.filter(product_id=product_id)
                logger.debug(f"Filtering reviews for product ID: {product_id}, found {queryset.count()} reviews")
            except (ValueError, TypeError):
                logger.error(f"Invalid product ID in query params: {product_id}")
                return Review.objects.none()  # Return empty queryset for invalid ID
        
        # Filter by user
        user_id = self.request.query_params.get('user')
        if user_id and self.request.user.is_staff:
            queryset = queryset.filter(user_id=user_id)
        
        # Users can view all reviews, but for other operations, they need authentication
        if self.action not in ['list', 'retrieve'] and not self.request.user.is_staff:
            queryset = queryset.filter(user=self.request.user)
        
        return queryset
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        # Log the queryset count and first item for debugging
        logger.debug(f"Reviews count: {queryset.count()}")
        if queryset.exists():
            first_review = queryset.first()
            logger.debug(f"First review: ID={first_review.id}, Product={first_review.product_id}, User={first_review.user_id}")
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        """Set the user when creating a review"""
        serializer.save(user=self.request.user)
        
    def create(self, request, *args, **kwargs):
        """Check if user has already reviewed this product"""
        product_id = request.data.get('product')
        if not product_id:
            return Response(
                {'detail': 'Product ID is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Check if product exists
        product = get_object_or_404(VendorProduct, pk=product_id)
        
        # Check if user has already reviewed this product
        existing_review = Review.objects.filter(
            product=product,
            user=request.user
        ).first()
        
        if existing_review:
            return Response(
                {'detail': 'You have already reviewed this product'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        return super().create(request, *args, **kwargs)
    
    @action(detail=True, methods=['delete'], url_path='media/(?P<media_id>[^/.]+)')
    def delete_media(self, request, pk=None, media_id=None):
        """Remove specific media from a review"""
        review = self.get_object()
        
        # Check if user owns this review
        if review.user != request.user and not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
            
        # Get and delete media
        media = get_object_or_404(ReviewMedia, pk=media_id, review=review)
        media.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['post'])
    def add_media(self, request, pk=None):
        """Add media to an existing review"""
        review = self.get_object()
        
        # Check if user owns this review
        if review.user != request.user and not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
            
        # Parse request data
        media_files = request.FILES.getlist('file')
        media_types = request.data.getlist('media_type')
        
        if not media_files:
            return Response(
                {'detail': 'No files provided'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if not media_types or len(media_types) != len(media_files):
            # Default to image if no types provided
            media_types = ['image'] * len(media_files)
            
        # Create media objects
        created_media = []
        for i, file in enumerate(media_files):
            media = ReviewMedia.objects.create(
                review=review,
                file=file,
                media_type=media_types[i] if i < len(media_types) else 'image'
            )
            created_media.append(media)
            
        # Serialize the created media
        serializer = ReviewMediaSerializer(
            created_media, 
            many=True,
            context={'request': request}
        )
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
