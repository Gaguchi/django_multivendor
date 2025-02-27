from django.shortcuts import render, redirect
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, UserProfileSerializer
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from .models import UserProfile
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
            user_data = {
                'username': user.username,
                'email': user.email,
                'profile': UserProfileSerializer(user.userprofile).data
            }
            return Response(user_data)
        except UserProfile.DoesNotExist:
            # Create profile if it doesn't exist
            profile = UserProfile.objects.create(user=user)
            user_data = {
                'username': user.username,
                'email': user.email,
                'profile': UserProfileSerializer(profile).data
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
