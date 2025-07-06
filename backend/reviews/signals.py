from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from .models import Review


@receiver(post_save, sender=Review)
def review_saved(sender, instance, created, **kwargs):
    """
    Signal handler for when a review is created or updated.
    Clears cache for the product to ensure fresh rating calculations.
    """
    # Clear any cached data for this product
    product_cache_key = f"product_{instance.product.id}"
    cache.delete(product_cache_key)
    
    # Also clear product list caches that might contain this product
    cache.delete_many([
        'hot_products',
        'featured_products',
        f'category_products_{instance.product.category_id}',
        'latest_products',
    ])


@receiver(post_delete, sender=Review)
def review_deleted(sender, instance, **kwargs):
    """
    Signal handler for when a review is deleted.
    Clears cache for the product to ensure fresh rating calculations.
    """
    # Clear any cached data for this product
    product_cache_key = f"product_{instance.product.id}"
    cache.delete(product_cache_key)
    
    # Also clear product list caches that might contain this product
    cache.delete_many([
        'hot_products',
        'featured_products',
        f'category_products_{instance.product.category_id}',
        'latest_products',
    ])
