from django.db import models
from vendors.models import Vendor
from django.utils import timezone

class VendorPayout(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Paid', 'Paid'),
    ]

    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='payouts')
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # Added default
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    requested_at = models.DateTimeField(default=timezone.now)
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Payout {self.id} to {self.vendor.store_name}"
