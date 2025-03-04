from django.db import models
from django.conf import settings
from vendors.models import VendorProduct
from django.utils import timezone
import os

def review_media_path(instance, filename):
    """Generate file path for review media uploads"""
    # Get extension and create unique filename
    _, ext = os.path.splitext(filename)
    # Organize files by product and user
    return f'reviews/{instance.review.product.id}/{instance.review.user.id}/{instance.get_media_type_display()}/{timezone.now().strftime("%Y%m%d%H%M%S")}{ext}'

class Review(models.Model):
    product = models.ForeignKey(VendorProduct, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(default=1)
    comment = models.TextField(default='')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('product', 'user')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Review by {self.user} on {self.product}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        product = self.product
        avg_rating = product.reviews.aggregate(models.Avg('rating'))['rating__avg'] or 0
        product.rating = round(avg_rating, 1)
        product.save(update_fields=['rating'])

class ReviewMedia(models.Model):
    MEDIA_TYPE_CHOICES = (
        ('image', 'Image'),
        ('video', 'Video'),
    )
    
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='media')
    file = models.FileField(upload_to=review_media_path)
    media_type = models.CharField(max_length=5, choices=MEDIA_TYPE_CHOICES, default='image')
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['created_at']
        verbose_name_plural = "Review Media"
    
    def __str__(self):
        return f"{self.get_media_type_display()} for review #{self.review.id}"
    
    def get_file_size(self):
        if self.file and hasattr(self.file, 'size'):
            return self.file.size / (1024*1024)
        return 0
