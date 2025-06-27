from django.db import models
from django.utils import timezone
from vendors.models import VendorProduct

class SearchLog(models.Model):
    """Log all search queries for analytics and improvement"""
    search_query = models.TextField()
    results_count = models.IntegerField(default=0)
    search_date = models.DateTimeField(default=timezone.now)
    user_ip = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    response_time_ms = models.IntegerField(null=True, blank=True)
    
    class Meta:
        ordering = ['-search_date']
    
    def __str__(self):
        return f"{self.search_query[:50]} - {self.results_count} results"

class ProductTag(models.Model):
    """Additional AI-focused tags for products"""
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, blank=True)  # e.g., 'feature', 'brand', 'use_case'
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name

class ProductTagAssociation(models.Model):
    """Many-to-many relationship between products and AI tags"""
    product = models.ForeignKey(VendorProduct, on_delete=models.CASCADE, related_name='ai_tags')
    tag = models.ForeignKey(ProductTag, on_delete=models.CASCADE, related_name='products')
    confidence = models.FloatField(default=1.0)  # AI confidence in this tag assignment
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        unique_together = ['product', 'tag']
        ordering = ['-confidence']
    
    def __str__(self):
        return f"{self.product.name} - {self.tag.name} ({self.confidence})"

class SearchResult(models.Model):
    """Cache search results for common queries"""
    query_hash = models.CharField(max_length=64, unique=True)  # MD5 hash of normalized query
    original_query = models.TextField()
    results_json = models.JSONField()  # Serialized search results
    created_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField()  # Cache expiration
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Cached: {self.original_query[:50]}"
