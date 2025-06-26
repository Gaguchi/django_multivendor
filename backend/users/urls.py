from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserRegisterView, TokenInfoView, RegisterOrLoginView,
    UpdateProfileView, ProfileView, UserLoginView, GoogleCallbackView, FacebookCallbackView,
    AddressListCreateView, AddressRetrieveUpdateDestroyView, DefaultAddressView,
    WishlistViewSet, GoogleAuthRedirectView, FacebookAuthRedirectView, EmailAvailabilityView
)

# Create a router for wishlist viewset
router = DefaultRouter()
router.register(r'wishlist', WishlistViewSet, basename='wishlist')

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),  # Supports both username and email login
    path('check-email/', EmailAvailabilityView.as_view(), name='check-email'),  # New endpoint for email availability
    
    # OAuth redirect URLs (new)
    path('auth/google/', GoogleAuthRedirectView.as_view(), name='google-auth'),
    path('auth/facebook/', FacebookAuthRedirectView.as_view(), name='facebook-auth'),
    
    # OAuth callback handlers (existing)
    path('auth/google/callback/', GoogleCallbackView.as_view(), name='google-callback'),
    path('auth/facebook/callback/', FacebookCallbackView.as_view(), name='facebook-callback'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/update/', UpdateProfileView.as_view(), name='profile-update'),
    path('token-info/', TokenInfoView.as_view(), name='token-info'),
    path('login-or-register/', RegisterOrLoginView.as_view(), name='login-or-register'),  # Supports both username and email login/registration
    
    # Address endpoints
    path('addresses/', AddressListCreateView.as_view(), name='address-list-create'),
    path('addresses/default/<str:address_type>/', DefaultAddressView.as_view(), name='default-address'),
    path('addresses/<int:pk>/', AddressRetrieveUpdateDestroyView.as_view(), name='address-detail'),
    
    # Include the wishlist routes
    path('', include(router.urls)),
    
    path('', include('social_django.urls', namespace='social')),
]
