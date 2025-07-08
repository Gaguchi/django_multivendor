from django.db import models
from django.utils import timezone
from django.utils.text import slugify

class Category(models.Model):
    name = models.CharField(max_length=100, default='')
    slug = models.SlugField(unique=True, null=True, blank=True)
    parent_category = models.ForeignKey(
        'self', null=True, blank=True, on_delete=models.SET_NULL, related_name='subcategories'
    )
    created_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(null=True, blank=True)
    display_order = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return self.name
    
    @property
    def product_count(self):
        """Get count of products in this category and all its subcategories"""
        from vendors.models import VendorProduct
        
        # Get all descendant categories (including self)
        descendant_ids = self.get_descendants_and_self()
        
        # Count products in any of these categories
        return VendorProduct.objects.filter(category_id__in=descendant_ids).count()
    
    def get_descendants_and_self(self):
        """Get IDs of this category and all its descendants"""
        result = [self.id]
        
        # Get direct children
        children = Category.objects.filter(parent_category=self)
        for child in children:
            result.extend(child.get_descendants_and_self())
        
        return result
    
    def get_root_category(self):
        """Get the root category for this category"""
        if self.parent_category is None:
            return self
        return self.parent_category.get_root_category()
    
    def get_breadcrumb_path(self):
        """Get the full path from root to this category"""
        path = []
        current = self
        while current:
            path.insert(0, current)
            current = current.parent_category
        return path
    
    def save(self, *args, **kwargs):
        # Auto-generate slug if not provided
        if not self.slug:
            self.slug = slugify(self.name)
        # Set timestamps if not provided
        if not self.created_at:
            self.created_at = timezone.now()
        self.updated_at = timezone.now()
        super().save(*args, **kwargs)
    
    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['display_order', 'name']


class AttributeGroup(models.Model):
    """
    Groups of related attributes, such as 'Screen', 'Interfaces', 'Dimensions', etc.
    """
    name = models.CharField(max_length=100)
    categories = models.ManyToManyField(Category, related_name='attribute_groups')
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['display_order', 'name']


class Attribute(models.Model):
    """
    Specific attributes within a group, such as 'Screen Size', 'Resolution', etc.
    """
    ATTRIBUTE_TYPES = (
        ('text', 'Text'),
        ('number', 'Number'),
        ('boolean', 'Boolean'),
        ('select', 'Select'),
        ('multi_select', 'Multiple Select'),
    )
    
    name = models.CharField(max_length=100)
    group = models.ForeignKey(AttributeGroup, on_delete=models.CASCADE, related_name='attributes')
    attribute_type = models.CharField(max_length=20, choices=ATTRIBUTE_TYPES, default='text')
    is_filterable = models.BooleanField(default=False, help_text="Can this attribute be used in filters?")
    is_required = models.BooleanField(default=False)
    has_tooltip = models.BooleanField(default=False)
    tooltip_text = models.TextField(blank=True, null=True)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} ({self.group.name})"
    
    def get_json_data(self):
        """Return attribute data for JavaScript usage"""
        return {
            'id': self.id,
            'name': self.name,
            'group': self.group.name,
            'type': self.attribute_type,
            'required': self.is_required,
        }
    
    class Meta:
        # Fix: adminsortable2 doesn't support relations in ordering
        # Change from ['group__display_order', 'display_order', 'name'] to:
        ordering = ['display_order', 'name']


class AttributeOption(models.Model):
    """
    Predefined options for select and multi-select attributes
    """
    attribute = models.ForeignKey(Attribute, on_delete=models.CASCADE, related_name='options')
    value = models.CharField(max_length=100)
    display_order = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return f"{self.value} ({self.attribute.name})"
    
    class Meta:
        ordering = ['display_order', 'value']
        unique_together = ['attribute', 'value']
