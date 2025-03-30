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
from django.conf import settings
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError
import jwt
import requests
import logging
from rest_framework.decorators import action
from vendors.models import VendorProduct
from django.shortcuts import get_object_or_404
import urllib.parse

logger = logging.getLogger(__name__)

# Add this new class for custom token refresh
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            # Call the parent class's post method
            response = super().post(request, *args, **kwargs)
            # Log the successful token refresh
            logger.info(f"Token refreshed successfully for user")
            return response
        except TokenError as e:
            # Log the token error
            logger.error(f"Token refresh failed: {str(e)}")
            # Pass the exception up
            raise InvalidToken(str(e))

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
        # Ensure we have the latest user object with profile
        self.user = User.objects.get(pk=self.user.pk)

    def post(self, request, *args, **kwargs):
        # Check if we need to extract profile data from a nested structure
        data = request.data.copy()
        
        # Handle nested userprofile structure if present
        if 'userprofile' in data and isinstance(data['userprofile'], dict):
            for key, value in data['userprofile'].items():
                if key not in data:
                    data[key] = value
        
        # If username isn't provided but email is, use email as username
        if not data.get('username') and data.get('email'):
            data['username'] = data['email']
            
        # Override request data with our processed data
        request._full_data = data
        
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_201_CREATED:
            tokens = self.create_token_for_user(self.user)
            profile_data = UserProfileSerializer(self.user.userprofile).data
            
            # Include user profile in response
            response.data.update({
                **tokens,
                'userprofile': profile_data,
                'username': self.user.username,
                'email': self.user.email,
                'id': self.user.id,
                'firstName': self.user.userprofile.first_name,
                'lastName': self.user.userprofile.last_name
            })
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
            try:
                refresh = RefreshToken.for_user(user)
                # Get or create profile if it doesn't exist
                profile, _ = UserProfile.objects.get_or_create(user=user)
                
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'username': user.username,
                    'email': user.email,
                    'id': user.id,
                    'firstName': profile.first_name or user.first_name,
                    'lastName': profile.last_name or user.last_name,
                    'userprofile': UserProfileSerializer(profile).data
                })
            except Exception as e:
                # If token blacklist tables don't exist yet, fall back to manual token creation
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f"Token generation error: {str(e)}")
                
                # Manual token creation without using blacklist
                from rest_framework_simplejwt.tokens import Token
                from datetime import datetime, timedelta
                import jwt
                from django.conf import settings
                
                # Create payload manually
                now = datetime.utcnow()
                access_payload = {
                    'token_type': 'access',
                    'exp': now + timedelta(minutes=15),
                    'iat': now,
                    'jti': Token._get_token_id(),
                    'user_id': user.id,
                }
                refresh_payload = {
                    'token_type': 'refresh',
                    'exp': now + timedelta(days=1),
                    'iat': now,
                    'jti': Token._get_token_id(),
                    'user_id': user.id,
                }
                
                # Encode tokens
                access = jwt.encode(
                    access_payload,
                    settings.SIMPLE_JWT['SIGNING_KEY'],
                    algorithm=settings.SIMPLE_JWT['ALGORITHM']
                )
                refresh = jwt.encode(
                    refresh_payload,
                    settings.SIMPLE_JWT['SIGNING_KEY'],
                    algorithm=settings.SIMPLE_JWT['ALGORITHM']
                )
                
                return Response({
                    'refresh': refresh,
                    'access': access,
                    'username': user.username,
                    'email': user.email,
                    'id': user.id,
                    'firstName': profile.first_name or user.first_name,
                    'lastName': profile.last_name or user.last_name,
                    'userprofile': UserProfileSerializer(profile).data
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
            
            # Enhanced logging for debugging
            logger.info(f"OAuth Callback Request: provider={state}, code_length={len(code) if code else 0}")
            logger.info(f"Redirect URI: {redirect_uri}")
            
            # Determine provider from state
            provider = 'facebook' if 'facebook' in state else 'google'
            
            # Fix redirect URI to use proper domain - accept URI as is, don't force HTTPS
            # This allows the callback to work from both development and production domains
            
            logger.info(f"Using redirect URI: {redirect_uri}")
            
            # Provider-specific configuration 
            if provider == 'facebook':
                token_url = 'https://graph.facebook.com/v16.0/oauth/access_token'
                client_id = settings.SOCIAL_AUTH_FACEBOOK_KEY
                client_secret = settings.SOCIAL_AUTH_FACEBOOK_SECRET
                userinfo_url = 'https://graph.facebook.com/v16.0/me'
            else:
                token_url = 'https://oauth2.googleapis.com/token'
                client_id = settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY
                client_secret = settings.SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET
                userinfo_url = 'https://www.googleapis.com/oauth2/v3/userinfo'
            
            # Exchange code for token - with proper encoding and format
            token_data = {
                'client_id': client_id,
                'client_secret': client_secret,
                'code': code,
                'redirect_uri': redirect_uri,
                'grant_type': 'authorization_code'
            }
            
            # Exchange code for token - with added error handling
            try:
                logger.info(f"Making token exchange request to: {token_url}")
                token_response = requests.post(
                    token_url, 
                    data=token_data,
                    timeout=10,  # Add timeout
                    headers={'Content-Type': 'application/x-www-form-urlencoded'}
                )
                
                if token_response.status_code != 200:
                    logger.error(f"Token exchange failed: {token_response.status_code} {token_response.text}")
                    return Response({
                        'error': f'Token exchange failed: {token_response.text}',
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                token_data = token_response.json()
                access_token = token_data.get('access_token')
                id_token = token_data.get('id_token')
                
                logger.info(f"Successfully obtained tokens from {provider}")
            except requests.RequestException as e:
                logger.error(f"Request error during token exchange: {str(e)}")
                return Response({'error': f'Error during token exchange: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # Rest of the method remains the same...
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
                    }
                }
            })

        except Exception as e:
            logger.exception(f"OAuth callback error: {str(e)}")
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

class GoogleAuthRedirectView(APIView):
    """Endpoint to redirect to Google OAuth2 authorization URL"""
    
    def get(self, request):
        # Get redirect_uri from query parameters
        redirect_uri = request.GET.get('redirect_uri')
        state = request.GET.get('state', '')
        
        if not redirect_uri:
            return Response({'error': 'redirect_uri is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Build the Google OAuth2 authorization URL
        params = {
            'client_id': settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY,
            'redirect_uri': redirect_uri,
            'response_type': 'code',
            'scope': 'email profile',
            'state': state,
            'access_type': 'offline',  # Request a refresh token
            'prompt': 'consent'  # Force showing the consent screen
        }
        
        auth_url = f'https://accounts.google.com/o/oauth2/v2/auth?{urllib.parse.urlencode(params)}'
        
        # Redirect to the Google authorization URL
        return redirect(auth_url)

class FacebookAuthRedirectView(APIView):
    """Endpoint to redirect to Facebook OAuth authorization URL"""
    
    def get(self, request):
        # Get redirect_uri from query parameters
        redirect_uri = request.GET.get('redirect_uri')
        state = request.GET.get('state', '')
        
        if not redirect_uri:
            return Response({'error': 'redirect_uri is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Build the Facebook OAuth authorization URL
        params = {
            'client_id': settings.SOCIAL_AUTH_FACEBOOK_KEY,
            'redirect_uri': redirect_uri,
            'response_type': 'code',
            'scope': 'email',
            'state': state
        }
        
        auth_url = f'https://www.facebook.com/v16.0/dialog/oauth?{urllib.parse.urlencode(params)}'
        
        # Redirect to the Facebook authorization URL
        return redirect(auth_url)
