from django.urls import path, include
from .views import (
    UserRegisterView, TokenInfoView, RegisterOrLoginView,
    UpdateProfileView, ProfileView, UserLoginView, GoogleCallbackView, FacebookCallbackView
)

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('auth/google/callback/', GoogleCallbackView.as_view(), name='google-callback'),
    path('auth/facebook/callback/', FacebookCallbackView.as_view(), name='facebook-callback'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/update/', UpdateProfileView.as_view(), name='profile-update'),
    path('token-info/', TokenInfoView.as_view(), name='token-info'),
    path('login-or-register/', RegisterOrLoginView.as_view(), name='login-or-register'),
    path('', include('social_django.urls', namespace='social')),
]
