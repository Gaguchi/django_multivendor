from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
# from products.models import Product  # Remove or comment this out if present

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
    name = models.CharField(max_length=100, default='')
    sku = models.CharField(max_length=50, blank=True, default='')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    stock = models.PositiveIntegerField(default=0)
    description = models.TextField(blank=True, default='')

    def product_directory_path(instance, filename):
        return f'vendor_products/{instance.vendor.store_name}/{instance.name}/{filename}'

    thumbnail = models.ImageField(upload_to=product_directory_path, null=True, blank=True)
    image = models.ImageField(upload_to=product_directory_path, null=True, blank=True)
    video = models.FileField(upload_to=product_directory_path, null=True, blank=True)
    # ...add more product-specific fields as needed...

    def __str__(self):
        return f"{self.vendor.store_name} - {self.name}"