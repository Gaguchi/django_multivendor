from django.urls import path, include
from .views import (
    UserRegisterView, TokenInfoView, RegisterOrLoginView,
    UpdateProfileView, ProfileView, UserLoginView, GoogleCallbackView, FacebookCallbackView,
    AddressListCreateView, AddressRetrieveUpdateDestroyView, DefaultAddressView
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
    
    # Address endpoints - reordered to fix routing issues
    path('addresses/', AddressListCreateView.as_view(), name='address-list-create'),
    path('addresses/default/<str:address_type>/', DefaultAddressView.as_view(), name='default-address'),
    path('addresses/<int:pk>/', AddressRetrieveUpdateDestroyView.as_view(), name='address-detail'),
    
    path('', include('social_django.urls', namespace='social')),
]
