from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VendorViewSet, ProductViewSet
import logging

logger = logging.getLogger(__name__)

router = DefaultRouter()
# Register the product viewset first to avoid path conflicts
router.register('products', ProductViewSet, basename='product')
router.register('', VendorViewSet, basename='vendor')

logger.info("=== Registering Vendor URLs ===")
logger.info(f"Registered URLs: {[str(url) for url in router.urls]}")

urlpatterns = router.urls
