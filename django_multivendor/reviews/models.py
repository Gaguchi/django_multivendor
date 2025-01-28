from django.db import models
from django.contrib.auth.models import User
from vendors.models import VendorProduct  # Changed from products.models import Product
from django.utils import timezone

class Review(models.Model):
    RATING_CHOICES = [(i, i) for i in range(1, 6)]

    product = models.ForeignKey(VendorProduct, on_delete=models.CASCADE, related_name='reviews')  # Changed to VendorProduct
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(choices=RATING_CHOICES, default=1)  # Added default
    comment = models.TextField(default='')  # Added default
    created_at = models.DateTimeField(null=True, blank=True)  # Made nullable
    updated_at = models.DateTimeField(null=True, blank=True)  # Made nullable
    
    def __str__(self):
        return f"Review by {self.user.username} for {self.product.name}"
