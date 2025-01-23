from django.db import models
from orders.models import Order
from django.utils import timezone

class Payment(models.Model):
    STATUS_CHOICES = [
        ('Completed', 'Completed'),
        ('Failed', 'Failed'),
        ('Pending', 'Pending'),
    ]

    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # Added default
    provider = models.CharField(max_length=50, default='')  # Added default
    transaction_id = models.CharField(max_length=100, unique=True, default='')  # Added default
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(null=True, blank=True)  # Made nullable
    
    def __str__(self):
        return f"Payment {self.transaction_id} for Order {self.order.order_number}"
