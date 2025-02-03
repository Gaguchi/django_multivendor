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

            if not code:
                return Response(
                    {'error': 'Authorization code is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Exchange auth code for tokens
            token_response = requests.post(
                'https://oauth2.googleapis.com/token',
                data={
                    'code': code,
                    'client_id': settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY,
                    'client_secret': settings.SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET,
                    'redirect_uri': redirect_uri,
                    'grant_type': 'authorization_code'
                }
            )
            
            if token_response.status_code != 200:
                return Response(
                    {'error': 'Failed to exchange code for tokens'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            token_data = token_response.json()

            # Get user info from Google
            user_info = requests.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                headers={'Authorization': f'Bearer {token_data["access_token"]}'}
            ).json()

            email = user_info['email']
            
            # Try to find existing user first
            try:
                user = User.objects.get(email=email)
                # Existing user - just update their info
                user.first_name = user_info.get('given_name', user.first_name)
                user.last_name = user_info.get('family_name', user.last_name)
                user.save()
            except User.DoesNotExist:
                # New user - create account
                user = User.objects.create_user(
                    username=email,
                    email=email,
                    first_name=user_info.get('given_name', ''),
                    last_name=user_info.get('family_name', '')
                )

            # Ensure UserProfile exists
            profile, _ = UserProfile.objects.get_or_create(
                user=user,
                defaults={
                    'first_name': user.first_name,
                    'last_name': user.last_name
                }
            )

            # Create JWT tokens for both new and existing users
            refresh = RefreshToken.for_user(user)

            return Response({
                'token': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'name': f"{user.first_name} {user.last_name}".strip(),
                    'isNewUser': _ # True if profile was created, False if it existed
                }
            })

        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
