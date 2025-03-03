from django.shortcuts import render, redirect
from rest_framework import generics, status, viewsets
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, UserProfileSerializer, AddressSerializer, WishlistSerializer
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from .models import UserProfile, Address, Wishlist
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.backends import TokenBackend
from datetime import timedelta
from rest_framework_simplejwt.settings import api_settings
from django.conf import settings  # Add this import
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError
import jwt
from social_core.backends.google import GoogleOAuth2
from social_core.exceptions import AuthForbidden
import requests
import logging
from rest_framework.decorators import action
from vendors.models import VendorProduct  # Changed from products.models import Product
from django.shortcuts import get_object_or_404

logger = logging.getLogger(__name__)

# Create your views here.

class UserRegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer

    def create_token_for_user(self, user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    def perform_create(self, serializer):
        self.user = serializer.save()

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_201_CREATED:
            tokens = self.create_token_for_user(self.user)
            response.data.update(tokens)
        return response

class RegisterOrLoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email', '')

        # Try authenticating first
        user = authenticate(username=username, password=password)
        if user:
            # User exists, just return tokens
            return Response(self._create_tokens(user), status=status.HTTP_200_OK)
        else:
            # Create user if they don’t exist
            user = User.objects.create_user(username=username, password=password, email=email)
            UserProfile.objects.create(user=user)  # or pass additional fields

            return Response(self._create_tokens(user), status=status.HTTP_201_CREATED)

    def _create_tokens(self, user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'username': user.username,
            'expires_in': refresh.access_token['exp'] - refresh.access_token['iat'],  # Token validity duration
        }

class UserLoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'username': user.username,
            })
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class TokenInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            token = request.META.get('HTTP_AUTHORIZATION', " ").split(' ')[1]
            
            # Try to decode the token
            valid_data = jwt.decode(
                token,
                settings.SIMPLE_JWT['SIGNING_KEY'],
                algorithms=[settings.SIMPLE_JWT['ALGORITHM']]
            )
            
            return Response(valid_data, status=status.HTTP_200_OK)
            
        except (IndexError, jwt.InvalidTokenError) as e:
            return Response(
                {
                    "detail": f"Invalid token: {str(e)}",
                    "token_received": token if 'token' in locals() else None
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )

class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request):
        """Update user and profile information"""
        user = request.user
        userprofile = user.userprofile
        
        # Update User model fields
        user_data = request.data.get('user', {})
        if 'email' in user_data:
            user.email = user_data['email']
            user.save()
            
        # Update UserProfile fields
        profile_data = request.data.get('profile', {})
        if profile_data:
            profile_serializer = UserProfileSerializer(userprofile, data=profile_data, partial=True)
            if profile_serializer.is_valid():
                profile_serializer.save()
            else:
                return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Return updated data
        return Response({
            'user': {
                'email': user.email,
                'username': user.username,
            },
            'profile': UserProfileSerializer(userprofile).data
        })

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get current user's profile"""
        user = request.user
        try:
            # Get default addresses if they exist
            default_shipping = None
            default_billing = None
            
            try:
                default_shipping = Address.objects.get(
                    user=user, 
                    address_type__in=['shipping', 'both'], 
                    is_default=True
                )
            except Address.DoesNotExist:
                pass
                
            try:
                default_billing = Address.objects.get(
                    user=user,
                    address_type__in=['billing', 'both'],
                    is_default=True
                )
            except Address.DoesNotExist:
                pass
                
            user_data = {
                'username': user.username,
                'email': user.email,
                'profile': UserProfileSerializer(user.userprofile).data,
                'addresses': {
                    'shipping': AddressSerializer(default_shipping).data if default_shipping else None,
                    'billing': AddressSerializer(default_billing).data if default_billing else None
                }
            }
            return Response(user_data)
        except UserProfile.DoesNotExist:
            # Create profile if it doesn't exist
            profile = UserProfile.objects.create(user=user)
            user_data = {
                'username': user.username,
                'email': user.email,
                'profile': UserProfileSerializer(profile).data,
                'addresses': {
                    'shipping': None,
                    'billing': None
                }
            }
            return Response(user_data)

class GoogleLoginCallbackView(APIView):
    def get(self, request, *args, **kwargs):
        # Get tokens from session (set by pipeline)
        tokens = request.session.get('jwt_tokens', {})
        
        # Clear tokens from session
        if 'jwt_tokens' in request.session:
            del request.session['jwt_tokens']
            
        # Redirect to frontend with tokens
        frontend_url = settings.FRONTEND_URL  # Add this to settings.py
        return redirect(f'{frontend_url}/login/callback?tokens={tokens}')

class GoogleCallbackView(APIView):
    def post(self, request):
        try:
            code = request.data.get('code')
            redirect_uri = request.data.get('redirect_uri')
            state = request.data.get('state', '')

            # Determine provider from state
            provider = 'facebook' if 'facebook' in state else 'google'
            
            # Prepare provider-specific parameters
            if provider == 'facebook':
                token_url = 'https://graph.facebook.com/v16.0/oauth/access_token'
                client_id = settings.SOCIAL_AUTH_FACEBOOK_KEY
                client_secret = settings.SOCIAL_AUTH_FACEBOOK_SECRET
                userinfo_url = 'https://graph.facebook.com/v16.0/me'
                userinfo_params = {
                    'fields': 'id,name,email,first_name,last_name',
                    'access_token': None  # Will be set after token exchange
                }
            else:
                # Existing Google configuration
                token_url = 'https://oauth2.googleapis.com/token'
                client_id = settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY
                client_secret = settings.SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET
                userinfo_url = 'https://www.googleapis.com/oauth2/v3/userinfo'

            # Exchange code for token
            token_response = requests.post(token_url, params={
                'client_id': client_id,
                'client_secret': client_secret,
                'code': code,
                'redirect_uri': redirect_uri,
                'grant_type': 'authorization_code'
            })

            if token_response.status_code != 200:
                return Response({
                    'error': f'Token exchange failed: {token_response.text}'
                }, status=status.HTTP_400_BAD_REQUEST)

            access_token = token_response.json().get('access_token')
            
            if provider == 'facebook':
                userinfo_params['access_token'] = access_token
                user_response = requests.get(userinfo_url, params=userinfo_params)
            else:
                # Existing Google user info fetch
                user_response = requests.get(
                    userinfo_url,
                    headers={'Authorization': f'Bearer {access_token}'}
                )

            if user_response.status_code != 200:
                return Response(
                    {'error': 'Failed to get user info'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            user_info = user_response.json()
            email = user_info.get('email')
            
            if not email:
                return Response(
                    {'error': 'Email not provided by OAuth provider'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get or create user and profile
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email,
                    'first_name': user_info.get('given_name', user_info.get('first_name', '')),
                    'last_name': user_info.get('family_name', user_info.get('last_name', ''))
                }
            )

            # Ensure profile exists
            profile, _ = UserProfile.objects.get_or_create(
                user=user,
                defaults={
                    'first_name': user.first_name,
                    'last_name': user.last_name
                }
            )

            # Create JWT tokens with additional user data
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'token': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'firstName': user.first_name,
                    'lastName': user.last_name,
                    'name': f"{user.first_name} {user.last_name}".strip(),
                    'profile': {
                        'id': profile.id,
                        'user_type': profile.user_type,
                        # Add any other profile fields you need
                    }
                }
            })

        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

class FacebookCallbackView(APIView):
    def post(self, request):
        logger.debug(f"Facebook callback received: {request.data}")
        
        try:
            code = request.data.get('code')
            redirect_uri = request.data.get('redirect_uri')
            
            logger.info(f"Processing Facebook callback with code: {code[:10]}... and redirect_uri: {redirect_uri}")

            # Exchange code for access token
            token_params = {
                'client_id': settings.SOCIAL_AUTH_FACEBOOK_KEY,
                'client_secret': settings.SOCIAL_AUTH_FACEBOOK_SECRET,
                'code': code,
                'redirect_uri': redirect_uri,
                'grant_type': 'authorization_code'
            }
            
            logger.debug(f"Token exchange params: {token_params}")
            token_response = requests.post('https://graph.facebook.com/v16.0/oauth/access_token', params=token_params)

            if token_response.status_code != 200:
                logger.error(f"Facebook token exchange failed: {token_response.text}")
                return Response({
                    'error': f'Facebook token exchange failed: {token_response.text}'
                }, status=status.HTTP_400_BAD_REQUEST)

            access_token = token_response.json().get('access_token')
            logger.info("Successfully obtained Facebook access token")

            # Get user info
            user_params = {
                'fields': 'id,name,email,first_name,last_name',
                'access_token': access_token
            }
            logger.debug(f"User info params: {user_params}")
            user_response = requests.get('https://graph.facebook.com/v16.0/me', params=user_params)

            if user_response.status_code != 200:
                logger.error(f"Failed to get Facebook user info: {user_response.text}")
                return Response({
                    'error': f'Failed to get Facebook user info: {user_response.text}'
                }, status=status.HTTP_400_BAD_REQUEST)

            user_info = user_response.json()
            logger.info(f"Retrieved Facebook user info: {user_info}")
            
            email = user_info.get('email')
            if not email:
                logger.error("No email provided by Facebook")
                return Response({
                    'error': 'Email not provided by Facebook'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Get or create user
            try:
                user = User.objects.get(email=email)
                logger.info(f"Found existing user: {user.username}")
            except User.DoesNotExist:
                user = User.objects.create_user(
                    username=email,
                    email=email,
                    first_name=user_info.get('first_name', ''),
                    last_name=user_info.get('last_name', '')
                )
                logger.info(f"Created new user: {user.username}")

            # Create/update profile
            profile, _ = UserProfile.objects.get_or_create(
                user=user,
                defaults={
                    'first_name': user.first_name,
                    'last_name': user.last_name
                }
            )

            # Generate tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                'token': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'firstName': user.first_name,
                    'lastName': user.last_name,
                    'name': user_info.get('name', ''),
                    'profile': {
                        'id': profile.id,
                        'user_type': profile.user_type
                    }
                }
            })

        except Exception as e:
            logger.exception("Facebook callback error")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class AddressListCreateView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AddressRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)


class DefaultAddressView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, address_type):
        if address_type not in ['shipping', 'billing', 'both']:
            return Response(
                {"error": "Invalid address type. Must be 'shipping', 'billing', or 'both'"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            address = Address.objects.get(
                user=request.user,
                address_type=address_type,
                is_default=True
            )
            serializer = AddressSerializer(address)
            return Response(serializer.data)
        except Address.DoesNotExist:
            return Response(
                {"detail": f"No default {address_type} address found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    def post(self, request, address_type):
        if address_type not in ['shipping', 'billing', 'both']:
            return Response(
                {"error": "Invalid address type. Must be 'shipping', 'billing', or 'both'"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        address_id = request.data.get('address_id')
        try:
            address = Address.objects.get(id=address_id, user=request.user)
            address.address_type = address_type
            address.is_default = True
            address.save()  # This will trigger the save method that handles default logic
            
            serializer = AddressSerializer(address)
            return Response(serializer.data)
        except Address.DoesNotExist:
            return Response(
                {"detail": "Address not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

class WishlistViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing wishlist items
    """
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def toggle(self, request):
        """
        Toggle a product in the wishlist (add if not present, remove if present)
        """
        product_id = request.data.get('product_id')
        if not product_id:
            return Response(
                {"error": "product_id is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Ensure the product exists
        product = get_object_or_404(VendorProduct, id=product_id)
        
        # Try to find an existing wishlist item
        try:
            wishlist_item = Wishlist.objects.get(
                user=request.user,
                product=product
            )
            # Item exists, so remove it
            wishlist_item.delete()
            return Response(
                {"message": "Product removed from wishlist", "in_wishlist": False},
                status=status.HTTP_200_OK
            )
        except Wishlist.DoesNotExist:
            # Item doesn't exist, so add it
            Wishlist.objects.create(user=request.user, product=product)
            return Response(
                {"message": "Product added to wishlist", "in_wishlist": True},
                status=status.HTTP_201_CREATED
            )
    
    @action(detail=False, methods=['get'])
    def check(self, request):
        """
        Check if a product is in the wishlist
        """
        product_id = request.query_params.get('product_id')
        if not product_id:
            return Response(
                {"error": "product_id query parameter is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        is_in_wishlist = Wishlist.objects.filter(
            user=request.user,
            product_id=product_id
        ).exists()
        
        return Response({"in_wishlist": is_in_wishlist})
