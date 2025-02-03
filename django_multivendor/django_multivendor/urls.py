"""
URL configuration for django_multivendor project.
"""
from django.urls import path, include
from django.contrib import admin
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.urls import get_resolver
from django.conf import settings
from django.conf.urls.static import static

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
    path('api/vendors/', include('vendors.urls')),
    path('api/users/', include('users.urls')),
    path('api/cart/', include('cart.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/payouts/', include('payouts.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/endpoints/', api_endpoints, name='api-endpoints'),
    path('api/categories/', include('categories.urls')),
    path('api/reviews/', include('reviews.urls')),
    path('api/shipping/', include('shipping.urls')),
    path('auth/', include('social_django.urls', namespace='social')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
