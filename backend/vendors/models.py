from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from categories.models import Attribute, AttributeOption

# Define helper functions for media file paths
def sanitize_filename(s):
    """Remove or replace characters that are problematic in file paths"""
    # Replace quotes, commas and other problematic characters
    invalid_chars = ['<', '>', ':', '"', '/', '\\', '|', '?', '*', ',']
    for char in invalid_chars:
        s = s.replace(char, '_')
    return s

def product_media_path(instance, filename):
    """Helper function to determine the path for product media uploads"""
    product = instance.product if hasattr(instance, 'product') else instance
    vendor_name = sanitize_filename(product.vendor.store_name.replace(' ', '_'))
    product_name = sanitize_filename(product.name.replace(' ', '_'))
    media_type = 'thumbnails' if hasattr(instance, 'is_thumbnail') else 'images'
    return f'vendor_products/{vendor_name}/{product_name}/{media_type}/{filename}'

def product_thumbnail_path(instance, filename):
    """Helper function for thumbnail uploads"""
    vendor_name = sanitize_filename(instance.vendor.store_name.replace(' ', '_'))
    product_name = sanitize_filename(instance.name.replace(' ', '_'))
    return f'vendor_products/{vendor_name}/{product_name}/thumbnails/{filename}'

def product_video_path(instance, filename):
    """Helper function for video uploads"""
    vendor_name = sanitize_filename(instance.vendor.store_name.replace(' ', '_'))
    product_name = sanitize_filename(instance.name.replace(' ', '_'))
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
    brand = models.CharField(max_length=100, blank=True, default='')
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
    display_order = models.PositiveIntegerField(default=0, blank=False, null=False)
    tags = models.TextField(blank=True, default='', help_text='Comma-separated tags for the product')
    
    # Add frequently bought together relationship
    frequently_bought_together = models.ManyToManyField(
        'self',
        blank=True,
        symmetrical=False,
        related_name='bought_with_products',
        help_text='Products that are frequently bought together with this product'
    )

    class Meta:
        ordering = ['display_order', 'name']

    def __str__(self):
        return f"{self.vendor.store_name} - {self.name}"
    
    def get_combo_total_price(self):
        """Calculate the total price of this product plus its combos"""
        total = self.price
        for product in self.frequently_bought_together.all():
            total += product.price
        return total
    
    def get_tags_list(self):
        """Return tags as a list"""
        if self.tags:
            return [tag.strip() for tag in self.tags.split(',') if tag.strip()]
        return []
    
    def set_tags_from_list(self, tags_list):
        """Set tags from a list of strings"""
        if tags_list:
            self.tags = ', '.join([tag.strip() for tag in tags_list if tag.strip()])
        else:
            self.tags = ''

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
    alt_text = models.CharField(max_length=255, blank=True, help_text="Alternative text for accessibility")
    
    class Meta:
        ordering = ['position']

    def __str__(self):
        return f"Image {self.position} for {self.product.name}"

class ProductAttributeValue(models.Model):
    """
    Stores the attribute values for products
    """
    product = models.ForeignKey(
        'VendorProduct', 
        on_delete=models.CASCADE, 
        related_name='attribute_values'
    )
    attribute = models.ForeignKey(
        Attribute, 
        on_delete=models.CASCADE, 
        related_name='product_values'
    )
    text_value = models.TextField(blank=True, null=True)
    number_value = models.DecimalField(max_digits=15, decimal_places=6, blank=True, null=True)
    boolean_value = models.BooleanField(blank=True, null=True)
    
    # For select/multi-select options
    option_values = models.ManyToManyField(
        AttributeOption, 
        blank=True, 
        related_name='product_values'
    )
    
    def __str__(self):
        value = self.get_value()
        return f"{self.product.name} - {self.attribute.name}: {value}"
    
    def get_value(self):
        """Return the appropriate value based on attribute type"""
        attr_type = self.attribute.attribute_type
        
        if attr_type == 'text':
            return self.text_value
        elif attr_type == 'number':
            return self.number_value
        elif attr_type == 'boolean':
            return 'Yes' if self.boolean_value else 'No'
        elif attr_type in ['select', 'multi_select']:
            return ', '.join([opt.value for opt in self.option_values.all()])
        
        return None
    
    class Meta:
        unique_together = ['product', 'attribute']