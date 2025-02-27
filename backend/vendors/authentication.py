from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from django.contrib.auth.models import AnonymousUser

class MasterTokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        master_token = request.META.get('HTTP_X_MASTER_TOKEN')
        if master_token and master_token == settings.MASTER_ACCESS_TOKEN:
            return (AnonymousUser(), None)
        return None

    def authenticate_header(self, request):
        return 'X-Master-Token'
