from django.db import models
from orders.models import Order
from django.utils import timezone

class Shipment(models.Model):
    STATUS_CHOICES = [
        ('Shipped', 'Shipped'),
        ('In Transit', 'In Transit'),
        ('Delivered', 'Delivered'),
    ]

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='shipments')
    tracking_number = models.CharField(max_length=100, unique=True, default='')  # Added default
    carrier = models.CharField(max_length=50, default='')  # Added default
    shipped_date = models.DateTimeField(null=True, blank=True)  # Made nullable
    estimated_delivery_date = models.DateTimeField(null=True, blank=True)  # Made nullable
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Shipped')
    created_at = models.DateTimeField(null=True, blank=True)  # Made nullable
    updated_at = models.DateTimeField(null=True, blank=True)  # Made nullable
    
    def __str__(self):
        return f"Shipment {self.tracking_number} for Order {self.order.order_number}"
