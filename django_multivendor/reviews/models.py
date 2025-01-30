from django.db import models
from django.conf import settings
from vendors.models import VendorProduct  # Changed from products.models import Product
from django.utils import timezone

class Review(models.Model):
    product = models.ForeignKey(VendorProduct, on_delete=models.CASCADE, related_name='reviews')  # Changed to VendorProduct
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(default=1)
    comment = models.TextField(default='')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Review by {self.user} on {self.product}"
