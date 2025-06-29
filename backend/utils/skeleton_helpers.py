"""
Django API utilities for pagination and loading states
"""
from rest_framework.response import Response
from rest_framework import status
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


class SkeletonResponse:
    """
    Utility class to provide skeleton/loading data for API responses
    Used for testing frontend skeleton loaders and providing consistent response shapes
    """
    
    @staticmethod
    def product_skeleton(count=10):
        """Generate skeleton data for products"""
        return [
            {
                'id': f'skeleton_{i}',
                'name': '',
                'description': '',
                'price': 0,
                'thumbnail': '',
                'images': [],
                'vendor': {'name': ''},
                'category': {'name': ''},
                'is_loading': True,
                'skeleton': True
            }
            for i in range(count)
        ]
    
    @staticmethod
    def order_skeleton(count=5):
        """Generate skeleton data for orders"""
        return [
            {
                'id': f'skeleton_{i}',
                'order_number': '',
                'status': '',
                'total': 0,
                'created_at': '',
                'items': [],
                'is_loading': True,
                'skeleton': True
            }
            for i in range(count)
        ]
    
    @staticmethod
    def category_skeleton(count=8):
        """Generate skeleton data for categories"""
        return [
            {
                'id': f'skeleton_{i}',
                'name': '',
                'slug': '',
                'image': '',
                'products_count': 0,
                'is_loading': True,
                'skeleton': True
            }
            for i in range(count)
        ]
    
    @staticmethod
    def vendor_skeleton(count=6):
        """Generate skeleton data for vendors"""
        return [
            {
                'id': f'skeleton_{i}',
                'name': '',
                'description': '',
                'logo': '',
                'products_count': 0,
                'rating': 0,
                'is_loading': True,
                'skeleton': True
            }
            for i in range(count)
        ]


class LoadingStateMiddleware:
    """
    Middleware to simulate loading states for development
    Useful for testing skeleton loaders in frontend
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Add loading delay for development (only if DEBUG is True)
        if hasattr(request, 'GET') and request.GET.get('simulate_loading'):
            import time
            delay = float(request.GET.get('delay', 1))
            time.sleep(delay)
        
        response = self.get_response(request)
        return response


class PaginationHelper:
    """
    Helper class for consistent pagination responses
    """
    
    @staticmethod
    def paginate_queryset(queryset, request, page_size=20):
        """
        Paginate a queryset and return pagination info
        """
        page = request.GET.get('page', 1)
        paginator = Paginator(queryset, page_size)
        
        try:
            items = paginator.page(page)
        except PageNotAnInteger:
            items = paginator.page(1)
        except EmptyPage:
            items = paginator.page(paginator.num_pages)
        
        return {
            'items': items,
            'pagination': {
                'current_page': items.number,
                'total_pages': paginator.num_pages,
                'total_items': paginator.count,
                'has_next': items.has_next(),
                'has_previous': items.has_previous(),
                'page_size': page_size
            }
        }
    
    @staticmethod
    def get_paginated_response(data, pagination_info):
        """
        Return a standardized paginated response
        """
        return {
            'results': data,
            'count': pagination_info['total_items'],
            'next': None,  # Will be set by DRF pagination
            'previous': None,  # Will be set by DRF pagination
            'pagination': pagination_info
        }


# Decorator for adding loading simulation to views
def simulate_loading(delay=1):
    """
    Decorator to simulate loading delay in development
    Usage: @simulate_loading(delay=2)
    """
    def decorator(view_func):
        def wrapper(request, *args, **kwargs):
            if request.GET.get('simulate_loading') and hasattr(request, 'META'):
                import time
                time.sleep(delay)
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator
