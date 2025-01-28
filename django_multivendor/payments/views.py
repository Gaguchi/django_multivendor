from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
import uuid
from .models import Payment
from .serializers import PaymentSerializer
from orders.models import Order

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(order__user=self.request.user)

    def perform_create(self, serializer):
        # Generate unique transaction ID
        transaction_id = f"TXN-{str(uuid.uuid4().hex[:12]).upper()}"
        
        # Get the order
        order = Order.objects.get(id=serializer.validated_data['order_id'])
        
        # Create payment
        payment = serializer.save(
            transaction_id=transaction_id,
            amount=order.total_amount,  # Use order's total amount
            created_at=timezone.now()
        )

        # Update order status if payment is completed
        if payment.status == 'Completed':
            order.status = 'Paid'
            order.save()

    @action(detail=True, methods=['post'])
    def process(self, request, pk=None):
        """Process the payment and update status"""
        payment = self.get_object()
        
        if payment.status != 'Pending':
            return Response(
                {'error': 'Payment cannot be processed'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Here you would typically integrate with a payment provider
        # For now, we'll just mark it as completed
        payment.status = 'Completed'
        payment.save()

        # Update order status
        payment.order.status = 'Paid'
        payment.order.save()

        return Response({'status': 'Payment processed successfully'})
