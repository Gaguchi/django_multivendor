from django.db import models
from django.utils import timezone

class Category(models.Model):
    name = models.CharField(max_length=100, default='')  # Added default
    slug = models.SlugField(unique=True, null=True, blank=True)  # Made nullable for migration
    parent_category = models.ForeignKey(
        'self', null=True, blank=True, on_delete=models.SET_NULL, related_name='subcategories'
    )
    created_at = models.DateTimeField(null=True, blank=True)  # Made nullable
    updated_at = models.DateTimeField(null=True, blank=True)  # Made nullable
    
    def __str__(self):
        return self.name

# Create your models here.
