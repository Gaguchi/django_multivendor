from rest_framework import serializers
from .models import Category, AttributeGroup, Attribute, AttributeOption

class AttributeOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttributeOption
        fields = ['id', 'value', 'display_order']


class AttributeSerializer(serializers.ModelSerializer):
    options = AttributeOptionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Attribute
        fields = [
            'id', 'name', 'group', 'attribute_type', 'is_filterable', 
            'is_required', 'has_tooltip', 'tooltip_text', 'display_order',
            'options'
        ]


class AttributeGroupSerializer(serializers.ModelSerializer):
    attributes = AttributeSerializer(many=True, read_only=True)
    
    class Meta:
        model = AttributeGroup
        fields = ['id', 'name', 'categories', 'display_order', 'attributes']


class CategorySerializer(serializers.ModelSerializer):
    subcategories = serializers.SerializerMethodField()
    attribute_groups = AttributeGroupSerializer(many=True, read_only=True)
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'parent_category', 'subcategories', 'attribute_groups', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def get_subcategories(self, obj):
        # Recursively serialize subcategories
        if obj.subcategories.exists():
            return CategorySerializer(obj.subcategories.all(), many=True).data
        return []


class AttributeGroupWithoutCategorySerializer(serializers.ModelSerializer):
    """Serializer for attribute groups used in detailed category views"""
    attributes = AttributeSerializer(many=True, read_only=True)
    
    class Meta:
        model = AttributeGroup
        fields = ['id', 'name', 'display_order', 'attributes']
        

class CategoryDetailSerializer(serializers.ModelSerializer):
    """Detailed category serializer with attribute groups"""
    subcategories = serializers.SerializerMethodField()
    attribute_groups = AttributeGroupWithoutCategorySerializer(many=True, read_only=True)
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'parent_category', 'subcategories', 'attribute_groups', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def get_subcategories(self, obj):
        return CategorySerializer(obj.subcategories.all(), many=True).data
