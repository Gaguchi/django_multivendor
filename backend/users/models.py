from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from vendors.models import VendorProduct  # Changed from products.models import Product

class UserProfile(models.Model):
    USER_TYPE_CHOICES = (
        ('vendor', 'Vendor'),
        ('customer', 'Customer'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='customer')
    first_name = models.CharField(max_length=30, default='')
    last_name = models.CharField(max_length=30, default='')
    phone = models.CharField(max_length=15, default='')
    # Removing the text address field since we now have Address model
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        name = f"{self.first_name} {self.last_name}".strip()
        if not name:
            name = self.user.username
        return f"{name}'s profile"

class Address(models.Model):
    ADDRESS_TYPE_CHOICES = (
        ('shipping', 'Shipping'),
        ('billing', 'Billing'),
        ('both', 'Both Shipping & Billing'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    address_type = models.CharField(max_length=10, choices=ADDRESS_TYPE_CHOICES, default='shipping')
    is_default = models.BooleanField(default=False)
    
    # Contact information
    full_name = models.CharField(max_length=100, help_text="Recipient's full name")
    phone_number = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    
    # Address details
    address_line1 = models.CharField(max_length=100)
    address_line2 = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=50)
    
    # Building access details
    apartment_number = models.CharField(max_length=20, blank=True, null=True, help_text="Apartment, suite, or unit number")
    entrance_number = models.CharField(max_length=20, blank=True, null=True)
    floor = models.CharField(max_length=10, blank=True, null=True)
    door_code = models.CharField(max_length=20, blank=True, null=True)
    
    # Delivery instructions
    delivery_instructions = models.TextField(blank=True, null=True, help_text="Special instructions for delivery")
    
    # Metadata
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "Addresses"
        ordering = ['-is_default', '-updated_at']
    
    def __str__(self):
        return f"{self.full_name}'s {self.get_address_type_display()} Address"
    
    def save(self, *args, **kwargs):
        # If this address is being set as default, unset any existing default of the same type
        if self.is_default:
            Address.objects.filter(
                user=self.user,
                address_type=self.address_type,
                is_default=True
            ).exclude(pk=self.pk).update(is_default=False)
            
            # If this is a "both" type default, unset other defaults too
            if self.address_type == 'both':
                Address.objects.filter(
                    user=self.user,
                    address_type__in=['shipping', 'billing'],
                    is_default=True
                ).exclude(pk=self.pk).update(is_default=False)
            
        super().save(*args, **kwargs)

class Wishlist(models.Model):
    """
    Model to store a user's wishlist items
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlists')
    product = models.ForeignKey(VendorProduct, on_delete=models.CASCADE, related_name='in_wishlists')  # Changed from Product to VendorProduct
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'product')
        ordering = ['-added_at']
    
    def __str__(self):
        return f"{self.user.username}'s wishlist item: {self.product.name}"
