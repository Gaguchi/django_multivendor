"""
ASGI config for django_multivendor project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application

# Import Django settings before importing channels
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_multivendor.settings')
django_asgi_app = get_asgi_application()

try:
    from channels.routing import ProtocolTypeRouter, URLRouter
    from channels.auth import AuthMiddlewareStack
    import orders.routing
    import chat.routing
    
    # Combine WebSocket URL patterns
    websocket_urlpatterns = orders.routing.websocket_urlpatterns + chat.routing.websocket_urlpatterns
    
    application = ProtocolTypeRouter({
        "http": django_asgi_app,
        "websocket": AuthMiddlewareStack(
            URLRouter(websocket_urlpatterns)
        ),
    })
except ImportError:
    # Fallback to Django ASGI if channels is not installed
    application = django_asgi_app
