from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VendorPayoutViewSet

router = DefaultRouter()
router.register('', VendorPayoutViewSet, basename='vendorpayout')

urlpatterns = router.urls
