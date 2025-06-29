"""
URL configuration for django_multivendor project.
"""
from django.urls import path, include
from django.contrib import admin
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.urls import get_resolver
from django.conf import settings
from django.conf.urls.static import static
import importlib.util

# Conditionally import the custom view based on availability
if importlib.util.find_spec('users.views'):
    from users.views import EnhancedTokenRefreshView
else:
    # Use the default view if the custom one isn't available
    from rest_framework_simplejwt.views import TokenRefreshView as CustomTokenRefreshView

@api_view(['GET'])
def api_endpoints(request):
    """List all available API endpoints"""
    endpoints = []
    resolver = get_resolver()
    
    def list_endpoints(resolver, prefix=''):
        for pattern in resolver.url_patterns:
            if hasattr(pattern, 'url_patterns'):
                list_endpoints(pattern, prefix + str(pattern.pattern))
            else:
                path = prefix + str(pattern.pattern)
                if hasattr(pattern.callback, 'actions'):
                    for method, action in pattern.callback.actions.items():
                        endpoints.append(f"{method.upper()}: {path}")
                else:
                    endpoints.append(f"ALL: {path}")
    
    list_endpoints(resolver)
    return Response({
        'available_endpoints': endpoints,
        'note': 'Endpoints prefixed with api/ are REST endpoints'
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', EnhancedTokenRefreshView.as_view(), name='token_refresh'),
    path('api/endpoints/', api_endpoints, name='api-endpoints'),
]

# Conditionally include app URLs based on installed apps
if 'vendors' in settings.INSTALLED_APPS:
    urlpatterns.append(path('api/vendors/', include('vendors.urls')))

if 'users' in settings.INSTALLED_APPS:
    urlpatterns.append(path('api/users/', include('users.urls')))

if 'cart' in settings.INSTALLED_APPS:
    urlpatterns.append(path('api/cart/', include('cart.urls')))

if 'orders' in settings.INSTALLED_APPS:
    urlpatterns.append(path('api/orders/', include('orders.urls')))

if 'payments' in settings.INSTALLED_APPS:
    urlpatterns.append(path('api/payments/', include('payments.urls')))

if 'payouts' in settings.INSTALLED_APPS:
    urlpatterns.append(path('api/payouts/', include('payouts.urls')))

if 'categories' in settings.INSTALLED_APPS:
    urlpatterns.append(path('api/categories/', include('categories.urls')))

if 'reviews' in settings.INSTALLED_APPS:
    urlpatterns.append(path('api/reviews/', include('reviews.urls')))

if 'shipping' in settings.INSTALLED_APPS:
    urlpatterns.append(path('api/shipping/', include('shipping.urls')))

if 'search' in settings.INSTALLED_APPS:
    urlpatterns.append(path('api/search/', include('search.urls')))

if 'ai_search' in settings.INSTALLED_APPS:
    urlpatterns.append(path('api/ai/', include('ai_search.urls')))

# Only include social auth URLs if the package is installed
if 'social_django' in settings.INSTALLED_APPS:
    urlpatterns.append(path('auth/', include('social_django.urls', namespace='social')))

# Serve media and static files in DEBUG mode
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
