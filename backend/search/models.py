from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from vendors.models import VendorProduct

class SearchLog(models.Model):
    """Log of search queries for analytics"""
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    session_key = models.CharField(max_length=40, null=True, blank=True)
    query = models.TextField()
    search_type = models.CharField(max_length=20, choices=[
        ('ai', 'AI Search'),
        ('keyword', 'Keyword Search'),
        ('tag', 'Tag Search'),
        ('fallback', 'Fallback Search')
    ], default='keyword')
    results_count = models.IntegerField(default=0)
    processing_time = models.FloatField(null=True, blank=True)  # in seconds
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        user_info = self.user.username if self.user else f"session:{self.session_key[:8]}"
        return f"{user_info} - {self.query[:50]}..."

class SearchResult(models.Model):
    """Individual search results for a query"""
    search_log = models.ForeignKey(SearchLog, on_delete=models.CASCADE, related_name='results')
    product = models.ForeignKey(VendorProduct, on_delete=models.CASCADE)
    rank = models.IntegerField()  # Result position
    relevance_score = models.FloatField(null=True, blank=True)
    matched_tags = models.TextField(blank=True)  # JSON string of matched tags
    
    class Meta:
        ordering = ['rank']
        unique_together = ['search_log', 'product']
    
    def __str__(self):
        return f"#{self.rank} - {self.product.name} (score: {self.relevance_score})"
