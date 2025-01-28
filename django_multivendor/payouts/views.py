from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import VendorPayout
from .serializers import VendorPayoutSerializer

class VendorPayoutViewSet(viewsets.ModelViewSet):
    serializer_class = VendorPayoutSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only allow staff or vendors to see their own payouts
        if self.request.user.is_staff:
            return VendorPayout.objects.all()
        return VendorPayout.objects.filter(vendor__user=self.request.user)
