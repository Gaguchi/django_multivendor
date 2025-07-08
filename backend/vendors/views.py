from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import serializers
from django.db import transaction, IntegrityError
from django.db.models import Q
import logging
from .models import Vendor, VendorProduct
from .serializers import VendorSerializer, ProductSerializer, ProductListSerializer, ProductDetailSerializer
from users.models import UserProfile
from rest_framework_simplejwt.authentication import JWTAuthentication
from .authentication import MasterTokenAuthentication
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

logger = logging.getLogger(__name__)

class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    
    def get_permissions(self):
        """Allow registration without authentication, require auth for other actions"""
        if self.action == 'register':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def initial(self, request, *args, **kwargs):
        """Log information before any other processing occurs"""
        logger.info("=== VendorViewSet Initial Processing ===")
        logger.info(f"Request Method: {request.method}")
        logger.info(f"Request User: {request.user}")
        logger.info(f"Request Auth: {request.auth}")
        logger.info(f"Request Headers: {request.headers}")
        return super().initial(request, *args, **kwargs)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        """Register a new vendor account"""
        logger.info("=== Vendor Registration ===")
        logger.info(f"Registration data: {request.data}")
        logger.info(f"Registration files: {request.FILES}")
        
        # Extract required fields
        email = request.data.get('email', '').strip().lower()  # Normalize email
        password = request.data.get('password', '')
        store_name = request.data.get('store_name', '').strip()
        first_name = request.data.get('first_name', '').strip()
        last_name = request.data.get('last_name', '').strip()
        phone = request.data.get('phone', '').strip()
        contact_email = request.data.get('contact_email', '').strip().lower() or email  # Normalize contact email
        description = request.data.get('description', '').strip()
        address = request.data.get('address', '').strip()
        
        # New fields for comprehensive registration
        business_type = request.data.get('business_type', '').strip()
        business_category = request.data.get('business_category', '')
        website = request.data.get('website', '').strip()
        
        # Social media fields
        facebook = request.data.get('facebook', '').strip()
        instagram = request.data.get('instagram', '').strip()
        twitter = request.data.get('twitter', '').strip()
        
        # Marketing preferences
        marketing_emails = request.data.get('marketing_emails', 'false').lower() == 'true'
        
        # Logo file
        logo_file = request.FILES.get('logo')
        
        # Validate required fields
        if not all([email, password, store_name, first_name, last_name]):
            return Response(
                {"error": "Email, password, store name, first name, and last name are required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Additional validation
        if len(password) < 8:
            return Response(
                {"password": ["Password must be at least 8 characters long"]}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Use atomic transaction to prevent race conditions
        try:
            with transaction.atomic():
                # Check if user already exists (within transaction for consistency)
                if User.objects.filter(email=email).exists():
                    return Response(
                        {"email": ["A user with this email already exists"]},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                # Check if store name is already taken
                if Vendor.objects.filter(store_name=store_name).exists():
                    return Response(
                        {"store_name": ["A store with this name already exists"]},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                try:
                    user = User.objects.create_user(
                        username=email,  # Use email as username
                        email=email,
                        password=password,
                        first_name=first_name,
                        last_name=last_name
                    )
                except IntegrityError as e:
                    if 'unique constraint' in str(e).lower() or 'unique violation' in str(e).lower():
                        return Response(
                            {"email": ["A user with this email or username already exists."]},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    raise
            
            # Create or update user profile as vendor
            profile, created = UserProfile.objects.get_or_create(user=user)
            profile.user_type = 'vendor'
            profile.first_name = first_name
            profile.last_name = last_name
            profile.phone = phone
            profile.save()
            
            # Prepare vendor data
            vendor_data = {
                'user': user,
                'store_name': store_name,
                'description': description,
                'contact_email': contact_email,
                'phone': phone,
                'address': address,
            }
            
            # Add logo if provided
            if logo_file:
                vendor_data['logo'] = logo_file
            
            vendor = Vendor.objects.create(**vendor_data)
            
            # Store additional information in description or create a separate metadata field
            additional_info = []
            if business_type:
                additional_info.append(f"Business Type: {business_type}")
            if website:
                additional_info.append(f"Website: {website}")
            if facebook:
                additional_info.append(f"Facebook: {facebook}")
            if instagram:
                additional_info.append(f"Instagram: {instagram}")
            if twitter:
                additional_info.append(f"Twitter: {twitter}")
            
            # Append additional info to description if any
            if additional_info:
                if vendor.description:
                    vendor.description += "\n\n--- Additional Information ---\n" + "\n".join(additional_info)
                else:
                    vendor.description = "--- Additional Information ---\n" + "\n".join(additional_info)
                vendor.save()
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            
            # Serialize vendor data
            vendor_serializer = VendorSerializer(vendor)
            
            logger.info(f"Vendor registration successful: {vendor.store_name}")
            
            return Response({
                'access': access_token,
                'refresh': refresh_token,
                'vendor': vendor_serializer.data,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name
                },
                'profile': {
                    'user_type': profile.user_type,
                    'first_name': profile.first_name,
                    'last_name': profile.last_name,
                    'phone': profile.phone
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Vendor registration failed: {str(e)}")
            # Clean up user if vendor creation failed
            if 'user' in locals():
                try:
                    user.delete()
                except:
                    pass
            return Response(
                {"error": "Registration failed. Please try again."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            profile.last_name = last_name
            profile.phone = phone
            profile.save()
            
            # Create vendor profile
            vendor = Vendor.objects.create(
                user=user,
                store_name=store_name,
                description=description,
                contact_email=contact_email,
                phone=phone,
                address=address
            )
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            
            # Serialize vendor data
            vendor_serializer = VendorSerializer(vendor)
            
            logger.info(f"Vendor registration successful: {vendor.store_name}")
            
            return Response({
                'access': access_token,
                'refresh': refresh_token,
                'vendor': vendor_serializer.data,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name
                },
                'profile': {
                    'user_type': profile.user_type,
                    'first_name': profile.first_name,
                    'last_name': profile.last_name,
                    'phone': profile.phone
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Vendor registration failed: {str(e)}")
            return Response(
                {"error": "Registration failed. Please try again."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def create(self, request, *args, **kwargs):
        logger.info("=== VendorViewSet Create Method ===")
        logger.info(f"Request Data: {request.data}")
        logger.info(f"=== Starting Vendor Creation ===")
        logger.info(f"User: {request.user}")
        logger.info(f"Auth: {request.auth}")
        logger.info(f"Headers: {request.headers}")
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        logger.info(f"Performing create for user: {self.request.user}")
        serializer.save(user=self.request.user)

    def get_permissions(self):
        """Log permission checks"""
        logger.info("=== Checking Permissions ===")
        perms = super().get_permissions()
        logger.info(f"Permission Classes: {perms}")
        return perms

    @action(detail=False, methods=['get'])
    def my_vendor(self, request):
        """Get the current user's vendor profile"""
        try:
            vendor = Vendor.objects.get(user=request.user)
            serializer = self.get_serializer(vendor)
            return Response(serializer.data)
        except Vendor.DoesNotExist:
            return Response(
                {"detail": "No vendor profile found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def profile(self, request):
        """Get vendor profile information for the authenticated user"""
        try:
            vendor = Vendor.objects.get(user=request.user)
            serializer = VendorSerializer(vendor)
            return Response({
                'vendor': serializer.data,
                'vendor_id': vendor.id,
                'user': {
                    'id': request.user.id,
                    'username': request.user.username,
                    'email': request.user.email,
                    'first_name': request.user.first_name,
                    'last_name': request.user.last_name
                }
            })
        except Vendor.DoesNotExist:
            return Response(
                {"error": "Vendor profile not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        """Get products for a specific vendor"""
        vendor = self.get_object()
        products = vendor.vendor_products.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

class ProductPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class ProductViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication, MasterTokenAuthentication]
    pagination_class = ProductPagination
    
    def get_permissions(self):
        """Allow read operations with master token, require authentication for others"""
        if self.action in ['list', 'retrieve']:
            permission_classes = []
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        elif self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductSerializer

    def get_queryset(self):
        queryset = VendorProduct.objects.select_related('vendor', 'category').all()
        
        # Apply filters for list view
        if self.action == 'list':
            # Optimize query for listings
            queryset = queryset.defer('description', 'video')
            
            # Apply filters from query parameters
            queryset = self._apply_filters(queryset)
            
        elif self.action == 'retrieve':
            # For detail view, prefetch frequently bought together products
            queryset = queryset.prefetch_related(
                'frequently_bought_together__vendor',
                'frequently_bought_together__category'
            )
        return queryset.order_by('-created_at')

    def _apply_filters(self, queryset):
        """Apply filters based on query parameters"""
        # Category filter - includes all descendant categories
        category = self.request.query_params.get('category')
        if category:
            from categories.models import Category
            # Support both category ID and category name
            if category.isdigit():
                try:
                    category_obj = Category.objects.get(id=category)
                    # Get all descendant category IDs (including self)
                    descendant_ids = category_obj.get_descendants_and_self()
                    queryset = queryset.filter(category__id__in=descendant_ids)
                except Category.DoesNotExist:
                    pass
            else:
                # Multiple categories separated by comma
                category_identifiers = [item.strip() for item in category.split(',') if item.strip()]
                if category_identifiers:
                    all_descendant_ids = []
                    
                    for identifier in category_identifiers:
                        if identifier.isdigit():
                            # It's a category ID
                            try:
                                category_obj = Category.objects.get(id=identifier)
                                all_descendant_ids.extend(category_obj.get_descendants_and_self())
                            except Category.DoesNotExist:
                                continue
                        else:
                            # It's a category name - find by name and include descendants
                            categories = Category.objects.filter(name__icontains=identifier)
                            for cat in categories:
                                all_descendant_ids.extend(cat.get_descendants_and_self())
                    
                    if all_descendant_ids:
                        # Remove duplicates
                        all_descendant_ids = list(set(all_descendant_ids))
                        queryset = queryset.filter(category__id__in=all_descendant_ids)
        
        # Vendor/Brand filter
        vendor = self.request.query_params.get('vendor')
        if vendor:
            # Support both vendor ID and vendor name
            if vendor.isdigit():
                queryset = queryset.filter(vendor__id=vendor)
            else:
                # Multiple vendors separated by comma
                vendor_names = [name.strip() for name in vendor.split(',') if name.strip()]
                if vendor_names:
                    vendor_filter = Q()
                    for name in vendor_names:
                        vendor_filter |= Q(vendor__store_name__icontains=name) | Q(vendor__user__username__icontains=name)
                    queryset = queryset.filter(vendor_filter)
        
        # Price range filters
        price_min = self.request.query_params.get('price_min')
        price_max = self.request.query_params.get('price_max')
        
        if price_min:
            try:
                queryset = queryset.filter(price__gte=float(price_min))
            except ValueError:
                pass  # Ignore invalid price_min values
        
        if price_max:
            try:
                queryset = queryset.filter(price__lte=float(price_max))
            except ValueError:
                pass  # Ignore invalid price_max values
        
        # Search query filter
        search = self.request.query_params.get('search') or self.request.query_params.get('q')
        if search:
            search_words = [word.strip() for word in search.split() if len(word.strip()) > 2]
            if search_words:
                search_filter = Q()
                for word in search_words:
                    search_filter |= Q(name__icontains=word) | Q(description__icontains=word) | Q(tags__icontains=word) | Q(brand__icontains=word)
                queryset = queryset.filter(search_filter)
        
        # Stock filter (only show products with stock by default)
        show_out_of_stock = self.request.query_params.get('show_out_of_stock', 'false').lower() == 'true'
        if not show_out_of_stock:
            queryset = queryset.filter(stock__gt=0)
        
        # Ordering
        ordering = self.request.query_params.get('ordering', '-created_at')
        valid_orderings = ['price', '-price', 'name', '-name', 'created_at', '-created_at', 'rating', '-rating']
        if ordering in valid_orderings:
            queryset = queryset.order_by(ordering)
        
        return queryset

    def perform_create(self, serializer):
        """Set the vendor automatically based on the authenticated user"""
        try:
            vendor = Vendor.objects.get(user=self.request.user)
            serializer.save(vendor=vendor)
        except Vendor.DoesNotExist:
            raise serializers.ValidationError("Must be a vendor to create products")

    def perform_update(self, serializer):
        """Ensure users can only update their own products"""
        product = self.get_object()
        if product.vendor.user != self.request.user:
            raise serializers.ValidationError("Can only update your own products")
        serializer.save()

    def perform_destroy(self, instance):
        """Ensure users can only delete their own products"""
        if instance.vendor.user != self.request.user:
            raise serializers.ValidationError("Can only delete your own products")
        instance.delete()

    @action(detail=False, methods=['get'])
    def my_products(self, request):
        """Get all products for the authenticated vendor"""
        try:
            vendor = Vendor.objects.get(user=request.user)
            products = self.get_queryset().filter(vendor=vendor)
            serializer = self.get_serializer(products, many=True)
            return Response(serializer.data)
        except Vendor.DoesNotExist:
            return Response(
                {"detail": "Vendor profile not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
