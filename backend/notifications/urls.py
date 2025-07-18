from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    NotificationViewSet, VendorNotificationViewSet,
    NotificationPreferencesViewSet, VendorNotificationPreferencesViewSet
)

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'vendor-notifications', VendorNotificationViewSet, basename='vendor-notification')
router.register(r'notification-preferences', NotificationPreferencesViewSet, basename='notification-preferences')
router.register(r'vendor-notification-preferences', VendorNotificationPreferencesViewSet, basename='vendor-notification-preferences')

urlpatterns = [
    path('', include(router.urls)),
]
