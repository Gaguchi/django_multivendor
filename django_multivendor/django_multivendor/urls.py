"""
URL configuration for django_multivendor project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path, include
from django.contrib import admin
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.urls import get_resolver
import logging
from django.conf import settings
from django.conf.urls.static import static

logger = logging.getLogger(__name__)

class LoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        logger.info(f"=== Incoming Request ===")
        logger.info(f"Path: {request.path}")
        logger.info(f"Method: {request.method}")
        logger.info(f"Headers: {request.headers}")
        response = self.get_response(request)
        logger.info(f"Response Status: {response.status_code}")
        return response

MIDDLEWARE = [
    'django_multivendor.urls.LoggingMiddleware',
    # ...existing middleware...
]

@api_view(['GET'])
def api_endpoints(request):
    """
    List all available API endpoints
    """
    endpoints = []
    resolver = get_resolver()
    
    def list_endpoints(resolver, prefix=''):
        for pattern in resolver.url_patterns:
            if hasattr(pattern, 'url_patterns'):
                # This is an included URLconf
                list_endpoints(pattern, prefix + str(pattern.pattern))
            else:
                # This is a URL pattern
                path = prefix + str(pattern.pattern)
                if hasattr(pattern.callback, 'actions'):
                    # ViewSet
                    for method, action in pattern.callback.actions.items():
                        endpoints.append(f"{method.upper()}: {path}")
                else:
                    # Regular view
                    endpoints.append(f"ALL: {path}")
    
    list_endpoints(resolver)
    
    # Log all endpoints
    logger.info("=== Available API Endpoints ===")
    for endpoint in endpoints:
        logger.info(endpoint)
    
    return Response({
        'available_endpoints': endpoints,
        'note': 'Endpoints prefixed with api/ are REST endpoints'
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/vendors/', include('vendors.urls')),  # This now handles /api/vendors/
    path('api/', include('products.urls')),  # Changed from 'api/products/' to 'api/'
    path('api/users/', include('users.urls')),
    path('api/cart/', include('cart.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/payouts/', include('payouts.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/endpoints/', api_endpoints, name='api-endpoints'),  # Add this line
    path('api/categories/', include('categories.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/reviews/', include('reviews.urls')),
    path('api/shipping/', include('shipping.urls')),
]

# For development only, serve uploaded media
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# ...existing code...
