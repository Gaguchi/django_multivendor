from django.shortcuts import render
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
