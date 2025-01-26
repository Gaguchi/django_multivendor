from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import VendorViewSet, ProductViewSet
import logging

logger = logging.getLogger(__name__)

# Log the URL patterns being registered
router = DefaultRouter()
logger.info("=== Registering Vendor URLs ===")
router.register('', VendorViewSet, basename='vendor')
logger.info(f"Registered URLs: {[str(url) for url in router.urls]}")

urlpatterns = router.urls
