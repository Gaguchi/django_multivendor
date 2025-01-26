from django.urls import path
from .views import UserRegisterView, TokenInfoView, RegisterOrLoginView

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='user_register'),
    path('login-or-register/', RegisterOrLoginView.as_view(), name='register_or_login'),  # Optional combined endpoint
    path('token-info/', TokenInfoView.as_view(), name='token_info'),  # New endpoint
]
