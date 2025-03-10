from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Define helper functions for media file paths
def product_media_path(instance, filename):
    """Helper function to determine the path for product media uploads"""
    product = instance.product if hasattr(instance, 'product') else instance
    vendor_name = product.vendor.store_name.replace(' ', '_')
    product_name = product.name.replace(' ', '_')
    media_type = 'thumbnails' if hasattr(instance, 'is_thumbnail') else 'images'
    return f'vendor_products/{vendor_name}/{product_name}/{media_type}/{filename}'

def product_thumbnail_path(instance, filename):
    """Helper function for thumbnail uploads"""
    vendor_name = instance.vendor.store_name.replace(' ', '_')
    product_name = instance.name.replace(' ', '_')
    return f'vendor_products/{vendor_name}/{product_name}/thumbnails/{filename}'

def product_video_path(instance, filename):
    """Helper function for video uploads"""
    vendor_name = instance.vendor.store_name.replace(' ', '_')
    product_name = instance.name.replace(' ', '_')
    return f'vendor_products/{vendor_name}/{product_name}/videos/{filename}'

class Vendor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, default=None)
    store_name = models.CharField(max_length=100, unique=True, default='')
    description = models.TextField(blank=True, default='')
    contact_email = models.EmailField(blank=True, default='')
    phone = models.CharField(max_length=15, blank=True, default='')
    address = models.TextField(blank=True, default='')
    logo = models.ImageField(upload_to='vendor_logos/', blank=True, default='vendor_logos/default_logo.png')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.store_name

class VendorProduct(models.Model):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='vendor_products')
    category = models.ForeignKey('categories.Category', on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=100)
    sku = models.CharField(max_length=50, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    old_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock = models.PositiveIntegerField(default=0)
    description = models.TextField(blank=True)
    thumbnail = models.ImageField(
        upload_to=product_thumbnail_path, 
        blank=True,
        default='vendor_products/default_thumbnail.png'
    )
    secondaryImage = models.ImageField(
        upload_to=product_thumbnail_path,
        blank=True,
        null=True
    )
    is_hot = models.BooleanField(default=False)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    created_at = models.DateTimeField(default=timezone.now)
    video = models.FileField(
        upload_to=product_video_path,
        blank=True,
        null=True,
        help_text='Upload product video file (MP4 recommended)'
    )

    def __str__(self):
        return f"{self.vendor.store_name} - {self.name}"

class ProductImage(models.Model):
    product = models.ForeignKey(
        VendorProduct,
        on_delete=models.CASCADE,
        related_name='product_images'
    )
    file = models.ImageField(
        upload_to=product_media_path
    )
    position = models.PositiveIntegerField(default=0, blank=False, null=False)

    class Meta:
        ordering = ['position']
        # Add sortable ordering if necessary, e.g., using adminsortable2's proxy

    def __str__(self):
        return f"Image {self.position} for {self.product.name}"