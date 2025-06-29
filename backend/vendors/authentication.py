from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from django.shortcuts import get_object_or_404
from .models import Vendor

class MasterTokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        master_token = request.META.get('HTTP_X_MASTER_TOKEN')
        vendor_id = request.META.get('HTTP_X_VENDOR_ID')
        
        if master_token and master_token == settings.MASTER_ACCESS_TOKEN:
            if vendor_id:
                try:
                    vendor = Vendor.objects.get(id=vendor_id)
                    # Attach vendor to request for easy access in views
                    request.vendor = vendor
                    return (vendor.user, None)
                except Vendor.DoesNotExist:
                    raise AuthenticationFailed('Invalid vendor ID')
            return (AnonymousUser(), None)
        return None

    def authenticate_header(self, request):
        return 'X-Master-Token'
