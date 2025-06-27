from rest_framework import serializers
from .models import SearchLog, ProductTag, ProductTagAssociation

class SearchLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchLog
        fields = ['id', 'search_query', 'results_count', 'search_date', 'response_time_ms']
        read_only_fields = ['id', 'search_date']

class ProductTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductTag
        fields = ['id', 'name', 'description', 'category', 'created_at']
        read_only_fields = ['id', 'created_at']

class AISearchRequestSerializer(serializers.Serializer):
    query = serializers.CharField(max_length=500, required=True)
    
    def validate_query(self, value):
        if not value.strip():
            raise serializers.ValidationError("Search query cannot be empty")
        return value.strip()

class AISearchResponseSerializer(serializers.Serializer):
    query = serializers.CharField()
    results = serializers.ListField()
    total_count = serializers.IntegerField()
    relevant_tags = serializers.ListField()
    response_time_ms = serializers.IntegerField()
    error = serializers.CharField(required=False)
