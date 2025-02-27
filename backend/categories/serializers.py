from rest_framework import serializers
from .models import Category

class CategorySerializer(serializers.ModelSerializer):
    subcategories = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'parent_category', 'subcategories', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def get_subcategories(self, obj):
        # Recursively serialize subcategories
        if obj.subcategories.exists():
            return CategorySerializer(obj.subcategories.all(), many=True).data
        return []
