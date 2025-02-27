from django.db import models
from django.contrib.auth.models import User
from vendors.models import VendorProduct  # Changed from products.models import Product
from vendors.models import Vendor
from django.utils import timezone
from datetime import timedelta

class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Paid', 'Paid'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Completed', 'Completed'),  # Payment cleared to vendor
        ('Disputed', 'Disputed'),
    ]

    PAYMENT_METHOD_CHOICES = [
        ('Credit Card', 'Credit Card'),
        ('PayPal', 'PayPal'),
        # Add other payment methods as needed
    ]

    PAYMENT_CLEARANCE_STATUS = [
        ('Pending', 'Pending'),
        ('Cleared', 'Cleared'),
        ('Held', 'Held'),  # For disputes/refunds
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    order_number = models.CharField(max_length=100, unique=True, default='')  # Added default
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # Added default
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='Credit Card')  # Added default
    shipping_address = models.TextField(default='')  # Added default
    billing_address = models.TextField(default='')  # Added default
    created_at = models.DateTimeField(null=True, blank=True)  # Made nullable
    updated_at = models.DateTimeField(null=True, blank=True)  # Made nullable
    delivered_at = models.DateTimeField(null=True, blank=True)
    payment_clearance_status = models.CharField(
        max_length=20, 
        choices=PAYMENT_CLEARANCE_STATUS,
        default='Pending'
    )
    payment_cleared_at = models.DateTimeField(null=True, blank=True)
    dispute_raised_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return self.order_number

    @property
    def is_ready_for_clearance(self):
        """Check if payment can be cleared to vendor"""
        if not self.delivered_at or self.payment_clearance_status != 'Pending':
            return False
            
        clearance_due_date = self.delivered_at + timedelta(days=7)
        return timezone.now() >= clearance_due_date and not self.dispute_raised_at

    def mark_as_delivered(self):
        """Mark order as delivered and start payment clearance countdown"""
        self.status = 'Delivered'
        self.delivered_at = timezone.now()
        self.save()

    def clear_payment(self):
        """Clear payment to vendor"""
        if self.is_ready_for_clearance:
            self.payment_clearance_status = 'Cleared'
            self.payment_cleared_at = timezone.now()
            self.status = 'Completed'
            self.save()
            return True
        return False

    def raise_dispute(self):
        """Raise a dispute and hold payment clearance"""
        self.dispute_raised_at = timezone.now()
        self.payment_clearance_status = 'Held'
        self.save()

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(VendorProduct, on_delete=models.CASCADE)  # Changed from Product to VendorProduct
    quantity = models.IntegerField(default=1)  # Added default
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # Added default
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # Added default
    
    def __str__(self):
        return f"{self.quantity} x {self.product.name}"
    
    @property
    def vendor(self):
        """Get vendor through the VendorProduct"""
        return self.product.vendor
