from django.db import models
from django.contrib.auth.models import User
from vendors.models import VendorProduct  # Changed from products.models import Product
from django.utils import timezone

class Cart(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE, related_name='carts')
    session_key = models.CharField(max_length=100, unique=True, null=True, blank=True)
    created_at = models.DateTimeField(null=True, blank=True)  # Made nullable
    updated_at = models.DateTimeField(null=True, blank=True)  # Made nullable
    
    def __str__(self):
        return f"Cart ({self.id})"

    @classmethod
    def get_or_create_cart(cls, user=None, session_key=None):
        """Get existing cart or create new one"""
        if user and user.is_authenticated:
            cart = cls.objects.filter(user=user).first()
            if cart:
                return cart
            
        if session_key:
            cart = cls.objects.filter(session_key=session_key).first()
            if cart:
                if user and user.is_authenticated:
                    # Transfer anonymous cart to user
                    cart.user = user
                    cart.session_key = None
                    cart.save()
                return cart

        # Create new cart
        return cls.objects.create(
            user=user if user and user.is_authenticated else None,
            session_key=session_key if not (user and user.is_authenticated) else None,
            created_at=timezone.now(),
            updated_at=timezone.now()
        )

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(VendorProduct, on_delete=models.CASCADE)  # Changed to VendorProduct
    quantity = models.IntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # Added default
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # Added default
    created_at = models.DateTimeField(null=True, blank=True)  # Made nullable
    updated_at = models.DateTimeField(null=True, blank=True)  # Made nullable
    
    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

    def save(self, *args, **kwargs):
        """Update total price before saving"""
        self.total_price = self.quantity * self.unit_price
        super().save(*args, **kwargs)
