from django.db import models
from django.contrib.auth.models import User
from products.models import Product
from django.utils import timezone

class Cart(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE, related_name='carts')
    session_key = models.CharField(max_length=100, unique=True, null=True, blank=True)
    created_at = models.DateTimeField(null=True, blank=True)  # Made nullable
    updated_at = models.DateTimeField(null=True, blank=True)  # Made nullable
    
    def __str__(self):
        return f"Cart ({self.id})"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # Added default
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # Added default
    created_at = models.DateTimeField(null=True, blank=True)  # Made nullable
    updated_at = models.DateTimeField(null=True, blank=True)  # Made nullable
    
    def __str__(self):
        return f"{self.quantity} x {self.product.name}"
