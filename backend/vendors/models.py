from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Define helper functions first
def product_media_path(instance, filename):
    """Helper function to determine the path for product media uploads"""
    media_type = 'thumbnails' if hasattr(instance, 'is_thumbnail') else 'images'
    
    # Check if instance is a VendorProduct or a related model like ProductImage
    if hasattr(instance, 'product'):
        # This is a ProductImage or similar model that has a 'product' attribute
        vendor = instance.product.vendor
        product_name = instance.product.name
    else:
        # This is a VendorProduct itself
        vendor = instance.vendor
        product_name = instance.name
        
    return f'vendor_products/{vendor.store_name}/{product_name}/{media_type}/{filename}'

def product_video_path(instance, filename):
    """Helper function for video uploads"""
    return f'vendor_products/{instance.vendor.store_name}/{instance.name}/videos/{filename}'

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
        upload_to=product_media_path, 
        blank=True, 
        default='vendor_products/default_thumbnail.png'
    )
    secondaryImage = models.ImageField(
        upload_to=product_media_path,
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