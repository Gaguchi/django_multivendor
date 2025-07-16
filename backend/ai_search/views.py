from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_headers
from django.db import models

from .gpt_service import gpt_ai_search_service
from .serializers import AISearchRequestSerializer, AISearchResponseSerializer
from .models import SearchLog, ProductTag

@api_view(['POST'])
@permission_classes([AllowAny])
def ai_search(request):
    """
    AI-powered product search endpoint
    """
    serializer = AISearchRequestSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    query = serializer.validated_data['query']
    
    # Get client information
    user_ip = request.META.get('REMOTE_ADDR')
    user_agent = request.META.get('HTTP_USER_AGENT', '')
    
    # Perform search
    search_results = gpt_ai_search_service.search_products(
        query=query,
        user_ip=user_ip,
        user_agent=user_agent
    )
    
    return Response(search_results, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
@method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
@method_decorator(vary_on_headers('User-Agent'))
def get_search_suggestions(request):
    """
    Get search suggestions based on popular queries and available tags
    """
    # Get popular search queries from the last 30 days
    from django.utils import timezone
    from datetime import timedelta
    
    thirty_days_ago = timezone.now() - timedelta(days=30)
    
    popular_queries = SearchLog.objects.filter(
        search_date__gte=thirty_days_ago,
        results_count__gt=0
    ).values('search_query').annotate(
        search_count=models.Count('search_query')
    ).order_by('-search_count')[:10]
    
    # Get available product tags
    tags = ProductTag.objects.all()[:20]
    
    suggestions = {
        'popular_queries': [item['search_query'] for item in popular_queries],
        'suggested_tags': [tag.name for tag in tags],
        'example_queries': [
            'wireless headphones under $100',
            'gaming laptop with good graphics',
            'smartphone with long battery life',
            'comfortable running shoes',
            'waterproof bluetooth speaker',
            'laptop for students',
            '4K TV with smart features',
            'wireless mouse for office work'
        ]
    }
    
    return Response(suggestions, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def search_analytics(request):
    """
    Get search analytics (admin only in production)
    """
    # Basic analytics
    from django.db.models import Avg, Count
    from django.utils import timezone
    from datetime import timedelta
    
    # Last 7 days analytics
    week_ago = timezone.now() - timedelta(days=7)
    
    analytics = {
        'total_searches': SearchLog.objects.count(),
        'searches_last_week': SearchLog.objects.filter(search_date__gte=week_ago).count(),
        'avg_response_time': SearchLog.objects.filter(
            response_time_ms__isnull=False
        ).aggregate(avg_time=Avg('response_time_ms'))['avg_time'],
        'top_queries': list(SearchLog.objects.filter(
            search_date__gte=week_ago
        ).values('search_query').annotate(
            count=Count('search_query')
        ).order_by('-count')[:10]),
        'searches_with_results': SearchLog.objects.filter(
            search_date__gte=week_ago,
            results_count__gt=0
        ).count()
    }
    
    return Response(analytics, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Check if AI search service is healthy
    """
    import requests
    from django.conf import settings
    
    health_status = {
        'status': 'healthy',
        'ollama_connected': False,
        'database_connected': True,
        'service_available': True
    }
    
    try:
        # Test database connectivity
        from .models import SearchLog
        SearchLog.objects.count()
        health_status['database_connected'] = True
    except Exception as e:
        health_status['database_connected'] = False
        health_status['database_error'] = str(e)
    
    try:
        # Test Ollama connectivity
        ollama_url = getattr(settings, 'OLLAMA_API_URL', 'http://localhost:11434/api/generate')
        
        # Try to connect to Ollama
        test_response = requests.get(
            ollama_url.replace('/api/generate', '/api/tags'),  # List models endpoint
            timeout=5
        )
        if test_response.status_code == 200:
            health_status['ollama_connected'] = True
            models = test_response.json().get('models', [])
            model_name = getattr(settings, 'OLLAMA_MODEL', 'gemma:7b')
            health_status['ai_model_available'] = any(
                model.get('name', '').startswith(model_name.split(':')[0]) 
                for model in models
            )
        else:
            health_status['ollama_connected'] = False
            health_status['ollama_error'] = f"HTTP {test_response.status_code}"
            
    except requests.exceptions.ConnectionError:
        health_status['ollama_connected'] = False
        health_status['ollama_error'] = "Connection refused - Ollama server not running"
    except Exception as e:
        health_status['ollama_connected'] = False
        health_status['ollama_error'] = str(e)
    
    try:
        # Test a simple search (this tests the full pipeline)
        test_result = gpt_ai_search_service.search_products("test", user_ip="127.0.0.1")
        health_status['search_working'] = test_result.get('total_count', 0) >= 0
        health_status['last_test_response_time'] = test_result.get('response_time_ms', 0)
    except Exception as e:
        health_status['search_working'] = False
        health_status['search_error'] = str(e)
    
    # Determine overall status
    if not health_status['database_connected']:
        health_status['status'] = 'critical'
        status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    elif not health_status.get('search_working', True):
        health_status['status'] = 'degraded'
        status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    elif not health_status['ollama_connected']:
        health_status['status'] = 'degraded'  # Still works with manual fallback
        health_status['note'] = 'AI features unavailable, using fallback search'
        status_code = status.HTTP_200_OK
    else:
        status_code = status.HTTP_200_OK
    
    return Response(health_status, status=status_code)
