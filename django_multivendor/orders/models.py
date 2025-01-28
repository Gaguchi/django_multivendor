from django.db import models
from django.contrib.auth.models import User
from vendors.models import VendorProduct  # Changed from products.models import Product
from vendors.models import Vendor
from django.utils import timezone

class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Paid', 'Paid'),
        ('Shipped', 'Shipped'),
        ('Completed', 'Completed'),
    ]

    PAYMENT_METHOD_CHOICES = [
        ('Credit Card', 'Credit Card'),
        ('PayPal', 'PayPal'),
        # Add other payment methods as needed
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
    
    def __str__(self):
        return self.order_number

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
