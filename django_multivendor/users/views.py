from django.shortcuts import render
from rest_framework import generics
from .serializers import UserSerializer

# Create your views here.

class UserRegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    # No extra authentication required here, so anyone can register
