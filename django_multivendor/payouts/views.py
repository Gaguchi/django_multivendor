from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.management import call_command
from rest_framework.decorators import action
from .models import VendorPayout, PayoutProcessingLog
from .serializers import VendorPayoutSerializer

class VendorPayoutViewSet(viewsets.ModelViewSet):
    serializer_class = VendorPayoutSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only allow staff or vendors to see their own payouts
        if self.request.user.is_staff:
            return VendorPayout.objects.all()
        return VendorPayout.objects.filter(vendor__user=self.request.user)

    @action(detail=False, methods=['post'])
    def process_pending(self, request):
        """Process pending payouts for the requesting vendor"""
        try:
            vendor = request.user.vendor
            
            # Call the management command with vendor filter
            call_command('process_payouts', vendor_id=vendor.id)
            
            # Get latest processing log
            latest_log = PayoutProcessingLog.objects.filter(vendor=vendor).latest()
            
            return Response({
                'status': 'success',
                'last_checked': latest_log.last_checked,
                'processed_orders': latest_log.processed_orders,
                'total_amount': latest_log.total_amount_processed
            })
        except:
            return Response(
                {'error': 'Failed to process payouts'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
