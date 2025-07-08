import json
import time
import re
import logging
from decimal import Decimal
from django.shortcuts import render
from django.db import models
from django.db.models import Q, Case, When, FloatField, Value
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from vendors.models import VendorProduct
from vendors.serializers import ProductListSerializer
from .models import SearchLog, SearchResult
import requests

logger = logging.getLogger(__name__)

# Configuration for Ollama
OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "gemma:7b"

# Predefined tags for fallback
DEFAULT_PRODUCT_TAGS = [
    # Electronics & Technology
    'smartphone', 'laptop', 'tablet', 'computer', 'gaming', 'headphones', 'speakers',
    'camera', 'tv', 'monitor', 'smartwatch', 'fitness tracker', 'wireless', 'bluetooth',
    'usb', 'charger', 'battery', 'cable', 'accessory', 'electronic', 'digital',
    
    # Fashion & Clothing
    'clothing', 'fashion', 'shirt', 'pants', 'dress', 'shoes', 'sneakers', 'boots',
    'jacket', 'coat', 'sweater', 'jeans', 'formal', 'casual', 'sportswear', 'activewear',
    'accessories', 'bag', 'purse', 'wallet', 'belt', 'hat', 'cap', 'sunglasses',
    
    # Home & Garden
    'home', 'furniture', 'decor', 'kitchen', 'appliance', 'tool', 'garden', 'outdoor',
    'lighting', 'storage', 'organization', 'cleaning', 'bathroom', 'bedroom',
    'living room', 'dining', 'office', 'workspace',
    
    # Health & Beauty
    'beauty', 'skincare', 'makeup', 'cosmetics', 'health', 'wellness', 'supplement',
    'vitamin', 'personal care', 'hygiene', 'medical', 'fitness', 'exercise',
    
    # Sports & Recreation
    'sports', 'outdoor', 'recreation', 'exercise', 'fitness', 'gym', 'running',
    'cycling', 'swimming', 'camping', 'hiking', 'travel', 'adventure',
    
    # Food & Beverages
    'food', 'beverage', 'drink', 'snack', 'organic', 'healthy', 'gourmet', 'spice',
    'ingredient', 'cooking', 'baking', 'recipe',
    
    # Books & Media
    'book', 'ebook', 'audiobook', 'magazine', 'music', 'movie', 'game', 'educational',
    'entertainment', 'media', 'content',
    
    # Automotive
    'car', 'automotive', 'vehicle', 'auto', 'parts', 'accessory', 'maintenance',
    'repair', 'motorcycle', 'bike',
    
    # Baby & Kids
    'baby', 'kids', 'children', 'toy', 'game', 'educational', 'learning', 'infant',
    'toddler', 'child', 'family',
    
    # Pet Supplies
    'pet', 'dog', 'cat', 'animal', 'pet food', 'pet toy', 'pet accessory', 'pet care'
]

def query_ollama(prompt):
    """Query Ollama AI model and return the response"""
    try:
        payload = {
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.3,
                "max_tokens": 200
            }
        }
        
        response = requests.post(OLLAMA_URL, json=payload, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            return result.get('response', '').strip()
        else:
            logger.error(f"Ollama API error: {response.status_code} - {response.text}")
            return None
    except requests.exceptions.RequestException as e:
        logger.error(f"Ollama connection error: {str(e)}")
        return None
    except Exception as e:
        logger.error(f"Ollama query error: {str(e)}")
        return None

def extract_tags_with_ai(query):
    """Use AI to extract relevant tags from search query"""
    prompt = f"""
    Analyze this product search query and extract relevant product tags or keywords that would help find products in an e-commerce store.

    Query: "{query}"

    Available product categories include: electronics, clothing, home, beauty, sports, food, books, automotive, baby, pets.

    Please respond with ONLY a comma-separated list of relevant tags or keywords (maximum 10 tags). Do not include explanations or other text.

    Examples:
    - "I need a new phone" → smartphone, mobile, electronics, communication
    - "comfortable running shoes" → shoes, sneakers, running, sports, footwear, athletic
    - "kitchen appliances for cooking" → kitchen, appliance, cooking, home, utensil

    Response:"""

    ai_response = query_ollama(prompt)
    
    if ai_response:
        # Clean and extract tags
        tags = []
        for tag in ai_response.split(','):
            tag = tag.strip().lower()
            # Remove quotes and extra characters
            tag = re.sub(r'[^\w\s-]', '', tag)
            if tag and len(tag) > 1:
                tags.append(tag)
        return tags[:10]  # Limit to 10 tags
    
    return []

def extract_tags_manual(query):
    """Fallback method to extract tags using keyword matching"""
    query_lower = query.lower()
    matched_tags = []
    
    # Direct tag matching
    for tag in DEFAULT_PRODUCT_TAGS:
        if tag.lower() in query_lower:
            matched_tags.append(tag)
    
    # Concept-based matching
    concept_mappings = {
        'phone': ['smartphone', 'mobile', 'communication'],
        'computer': ['laptop', 'desktop', 'pc'],
        'clothes': ['clothing', 'fashion', 'apparel'],
        'shoes': ['footwear', 'sneakers', 'boots'],
        'house': ['home', 'furniture', 'decor'],
        'kitchen': ['cooking', 'appliance', 'utensil'],
        'exercise': ['fitness', 'sports', 'gym'],
        'book': ['reading', 'literature', 'educational'],
        'car': ['automotive', 'vehicle', 'transportation'],
        'baby': ['infant', 'children', 'kids'],
        'pet': ['animal', 'dog', 'cat']
    }
    
    for keyword, related_tags in concept_mappings.items():
        if keyword in query_lower:
            matched_tags.extend(related_tags)
    
    # Remove duplicates and return
    return list(set(matched_tags))

def search_products_by_tags(tags, limit=20):
    """Search products using tags with relevance scoring"""
    if not tags:
        return VendorProduct.objects.none(), {}
    
    # Build Q objects for tag matching
    tag_queries = []
    for tag in tags:
        tag_queries.append(Q(tags__icontains=tag))
        tag_queries.append(Q(name__icontains=tag))
        tag_queries.append(Q(description__icontains=tag))
        tag_queries.append(Q(brand__icontains=tag))
        tag_queries.append(Q(category__name__icontains=tag))
    
    # Combine all queries with OR
    combined_query = tag_queries[0]
    for query in tag_queries[1:]:
        combined_query |= query
    
    # Get products and calculate relevance scores
    products = VendorProduct.objects.filter(
        combined_query,
        stock__gt=0  # Only in-stock products
    ).distinct()
    
    # Calculate relevance scores
    product_scores = {}
    for product in products:
        score = 0
        matched_tags = []
        
        # Check each tag against product fields
        for tag in tags:
            tag_lower = tag.lower()
            
            # Tag field match (highest weight)
            if tag_lower in product.tags.lower():
                score += 10
                matched_tags.append(tag)
            
            # Name match (high weight)
            if tag_lower in product.name.lower():
                score += 8
                matched_tags.append(tag)
            
            # Brand match (medium weight)
            if tag_lower in product.brand.lower():
                score += 6
                matched_tags.append(tag)
            
            # Description match (low weight)
            if tag_lower in product.description.lower():
                score += 3
                matched_tags.append(tag)
            
            # Category match (medium weight)
            if product.category and tag_lower in product.category.name.lower():
                score += 7
                matched_tags.append(tag)
        
        # Boost for popular products
        if product.rating > 4.0:
            score += 2
        if product.is_hot:
            score += 3
        
        product_scores[product.id] = {
            'score': score,
            'matched_tags': list(set(matched_tags))
        }
    
    # Sort by relevance score
    sorted_products = sorted(
        products, 
        key=lambda p: product_scores.get(p.id, {}).get('score', 0), 
        reverse=True
    )
    
    return sorted_products[:limit], product_scores

@api_view(['POST'])
@permission_classes([AllowAny])
def ai_search(request):
    """AI-powered product search endpoint"""
    start_time = time.time()
    
    try:
        data = request.data
        query = data.get('query', '').strip()
        
        if not query:
            return Response({
                'error': 'Search query is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get user info for logging
        user = request.user if request.user.is_authenticated else None
        session_key = request.session.session_key
        
        logger.info(f"AI Search query: '{query}' from user: {user or session_key}")
        
        # Try AI tag extraction first
        ai_tags = extract_tags_with_ai(query)
        search_type = 'ai' if ai_tags else 'fallback'
        
        # Fallback to manual extraction if AI fails
        if not ai_tags:
            ai_tags = extract_tags_manual(query)
            search_type = 'tag' if ai_tags else 'keyword'
        
        logger.info(f"Extracted tags: {ai_tags}")
        
        # Search products using tags
        if ai_tags:
            products, product_scores = search_products_by_tags(ai_tags)
        else:
            # Final fallback: simple keyword search
            search_type = 'keyword'
            products = VendorProduct.objects.filter(
                Q(name__icontains=query) |
                Q(description__icontains=query) |
                Q(brand__icontains=query) |
                Q(tags__icontains=query),
                stock__gt=0
            ).distinct()[:20]
            product_scores = {}
        
        # Serialize products
        serializer = ProductListSerializer(products, many=True)
        
        # Calculate processing time
        processing_time = time.time() - start_time
        
        # Log search
        search_log = SearchLog.objects.create(
            user=user,
            session_key=session_key,
            query=query,
            search_type=search_type,
            results_count=len(products),
            processing_time=processing_time
        )
        
        # Log individual results
        for rank, product in enumerate(products, 1):
            score_info = product_scores.get(product.id, {})
            SearchResult.objects.create(
                search_log=search_log,
                product=product,
                rank=rank,
                relevance_score=score_info.get('score', 0),
                matched_tags=json.dumps(score_info.get('matched_tags', []))
            )
        
        response_data = {
            'query': query,
            'results_count': len(products),
            'processing_time': round(processing_time, 3),
            'search_type': search_type,
            'extracted_tags': ai_tags,
            'products': serializer.data
        }
        
        logger.info(f"Search completed: {len(products)} results in {processing_time:.3f}s")
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"AI Search error: {str(e)}")
        return Response({
            'error': 'Search failed',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def search_suggestions(request):
    """Get search suggestions based on popular queries and products"""
    try:
        # Get popular search terms from logs
        popular_queries = SearchLog.objects.values('query').annotate(
            count=models.Count('query')
        ).filter(
            count__gt=1,
            created_at__gte=timezone.now() - timezone.timedelta(days=30)
        ).order_by('-count')[:10]
        
        # Get popular product names and brands
        popular_products = VendorProduct.objects.filter(
            stock__gt=0,
            rating__gte=4.0
        ).values('name', 'brand').distinct()[:10]
        
        # Combine suggestions
        suggestions = []
        
        # Add popular search queries
        for item in popular_queries:
            suggestions.append({
                'text': item['query'],
                'type': 'popular_search',
                'count': item['count']
            })
        
        # Add product-based suggestions
        for product in popular_products:
            if product['name']:
                suggestions.append({
                    'text': product['name'],
                    'type': 'product'
                })
            if product['brand']:
                suggestions.append({
                    'text': product['brand'],
                    'type': 'brand'
                })
        
        # Add some category suggestions
        category_suggestions = [
            'smartphones', 'laptops', 'clothing', 'shoes', 'home decor',
            'kitchen appliances', 'beauty products', 'sports equipment'
        ]
        
        for category in category_suggestions:
            suggestions.append({
                'text': category,
                'type': 'category'
            })
        
        # Remove duplicates and limit
        seen = set()
        unique_suggestions = []
        for suggestion in suggestions:
            if suggestion['text'].lower() not in seen:
                seen.add(suggestion['text'].lower())
                unique_suggestions.append(suggestion)
                if len(unique_suggestions) >= 15:
                    break
        
        return Response({
            'suggestions': unique_suggestions
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Search suggestions error: {str(e)}")
        return Response({
            'error': 'Failed to get suggestions',
            'suggestions': []
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def search_analytics(request):
    """Get search analytics (admin only)"""
    if not request.user.is_authenticated or not request.user.is_staff:
        return Response({
            'error': 'Admin access required'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        # Get analytics data
        total_searches = SearchLog.objects.count()
        
        # Searches by type
        search_types = SearchLog.objects.values('search_type').annotate(
            count=models.Count('search_type')
        ).order_by('-count')
        
        # Popular queries
        popular_queries = SearchLog.objects.values('query').annotate(
            count=models.Count('query')
        ).filter(count__gt=1).order_by('-count')[:20]
        
        # Recent searches
        recent_searches = SearchLog.objects.select_related('user').order_by('-created_at')[:20]
        recent_data = []
        for search in recent_searches:
            recent_data.append({
                'query': search.query,
                'user': search.user.username if search.user else 'Anonymous',
                'search_type': search.search_type,
                'results_count': search.results_count,
                'processing_time': search.processing_time,
                'created_at': search.created_at
            })
        
        # Average processing times by search type
        avg_times = SearchLog.objects.values('search_type').annotate(
            avg_time=models.Avg('processing_time')
        ).order_by('search_type')
        
        return Response({
            'total_searches': total_searches,
            'search_types': search_types,
            'popular_queries': popular_queries,
            'recent_searches': recent_data,
            'average_processing_times': avg_times
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Search analytics error: {str(e)}")
        return Response({
            'error': 'Failed to get analytics'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def regular_search(request):
    """Regular text-based product search endpoint"""
    start_time = time.time()
    
    try:
        query = request.GET.get('q', '').strip()
        category = request.GET.get('category', '').strip()
        sort_by = request.GET.get('sort', 'relevance')  # relevance, price_low, price_high, rating, newest
        page = int(request.GET.get('page', 1))
        per_page = min(int(request.GET.get('per_page', 20)), 50)  # Max 50 items per page
        
        if not query:
            return Response({
                'error': 'Search query is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get user info for logging
        user = request.user if request.user.is_authenticated else None
        session_key = request.session.session_key
        
        logger.info(f"Regular search query: '{query}' category: '{category}' from user: {user or session_key}")
        
        # Build the search query
        search_query = Q()
        
        # Split query into words for better matching
        search_words = [word.strip() for word in query.split() if len(word.strip()) > 2]
        
        if search_words:
            # Search in product name (highest priority)
            name_query = Q()
            for word in search_words:
                name_query |= Q(name__icontains=word)
            
            # Search in description
            desc_query = Q()
            for word in search_words:
                desc_query |= Q(description__icontains=word)
            
            # Search in tags
            tags_query = Q()
            for word in search_words:
                tags_query |= Q(tags__icontains=word)
            
            # Search in brand
            brand_query = Q()
            for word in search_words:
                brand_query |= Q(brand__icontains=word)
            
            # Combine all search conditions
            search_query = name_query | desc_query | tags_query | brand_query
        
        # Start with active products that have stock
        products = VendorProduct.objects.filter(
            stock__gt=0
        ).select_related('vendor', 'category')
        
        # Apply search filter
        if search_query:
            products = products.filter(search_query)
        
        # Apply category filter - includes all descendant categories
        if category:
            from categories.models import Category
            try:
                # If category is a digit, treat it as ID
                if category.isdigit():
                    category_obj = Category.objects.get(id=category)
                    descendant_ids = category_obj.get_descendants_and_self()
                    products = products.filter(category__id__in=descendant_ids)
                else:
                    # If category is a name, find by name and include descendants
                    category_obj = Category.objects.filter(name__icontains=category).first()
                    if category_obj:
                        descendant_ids = category_obj.get_descendants_and_self()
                        products = products.filter(category__id__in=descendant_ids)
                    else:
                        # Fallback to original name-based filtering if no exact match
                        products = products.filter(category__name__icontains=category)
            except Category.DoesNotExist:
                # Fallback to original name-based filtering
                products = products.filter(category__name__icontains=category)
        
        # Calculate relevance score for sorting
        if search_words:
            # Annotate with relevance score
            relevance_cases = []
            
            for i, word in enumerate(search_words):
                # Name matches get highest score
                relevance_cases.append(
                    When(name__icontains=word, then=Value(10.0 - i))
                )
                # Brand matches get medium score  
                relevance_cases.append(
                    When(brand__icontains=word, then=Value(7.0 - i))
                )
                # Tags matches get medium score
                relevance_cases.append(
                    When(tags__icontains=word, then=Value(6.0 - i))
                )
                # Description matches get lower score
                relevance_cases.append(
                    When(description__icontains=word, then=Value(3.0 - i))
                )
            
            products = products.annotate(
                relevance_score=Case(
                    *relevance_cases,
                    default=Value(0.0),
                    output_field=FloatField()
                )
            )
        else:
            # No search words, set default relevance
            products = products.annotate(relevance_score=Value(0.0, output_field=FloatField()))
        
        # Apply sorting
        if sort_by == 'price_low':
            products = products.order_by('price')
        elif sort_by == 'price_high':
            products = products.order_by('-price')
        elif sort_by == 'rating':
            products = products.order_by('-rating', '-relevance_score')
        elif sort_by == 'newest':
            products = products.order_by('-id')
        else:  # relevance (default)
            products = products.order_by('-relevance_score', '-rating', 'price')
        
        # Get total count before pagination
        total_count = products.count()
        
        # Apply pagination
        start_index = (page - 1) * per_page
        end_index = start_index + per_page
        products_page = products[start_index:end_index]
        
        # Serialize the products
        serializer = ProductListSerializer(products_page, many=True, context={'request': request})
        
        # Calculate pagination info
        total_pages = (total_count + per_page - 1) // per_page
        has_next = page < total_pages
        has_previous = page > 1
        
        # Log the search
        SearchLog.objects.create(
            query=query,
            user=user,
            session_key=session_key,
            results_count=total_count,
            search_type='regular'
        )
        
        # Calculate response time
        response_time = int((time.time() - start_time) * 1000)
        
        return Response({
            'query': query,
            'category': category,
            'results': serializer.data,
            'pagination': {
                'current_page': page,
                'total_pages': total_pages,
                'total_count': total_count,
                'per_page': per_page,
                'has_next': has_next,
                'has_previous': has_previous
            },
            'search_type': 'regular',
            'sort_by': sort_by,
            'response_time_ms': response_time
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Regular search error: {str(e)}")
        return Response({
            'error': 'Search failed',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
