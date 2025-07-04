from django.db import models
from django.conf import settings
from vendors.models import VendorProduct  # Changed from products.models import Product
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator

class Review(models.Model):
    product = models.ForeignKey(VendorProduct, on_delete=models.CASCADE, related_name='reviews')  # Changed to VendorProduct
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    order = models.ForeignKey('orders.Order', on_delete=models.CASCADE, related_name='reviews', null=True, blank=True)
    rating = models.IntegerField(
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField(default='')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'product']  # One review per user per product
        ordering = ['-created_at']

    def __str__(self):
        return f"Review by {self.user} on {self.product} - {self.rating} stars"


class ReviewImage(models.Model):
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='reviews/images/')
    alt_text = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for review {self.review.id}"


class ReviewVideo(models.Model):
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='videos')
    video = models.FileField(upload_to='reviews/videos/')
    thumbnail = models.ImageField(upload_to='reviews/thumbnails/', blank=True, null=True)
    duration = models.PositiveIntegerField(null=True, blank=True, help_text="Duration in seconds")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Video for review {self.review.id}"
