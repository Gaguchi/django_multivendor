from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Shipment
from .serializers import ShipmentSerializer

class ShipmentViewSet(viewsets.ModelViewSet):
    serializer_class = ShipmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Staff sees all shipments, regular users see only shipments for their orders
        if self.request.user.is_staff:
            return Shipment.objects.all()
        return Shipment.objects.filter(order__user=self.request.user)

# Create your views here.
