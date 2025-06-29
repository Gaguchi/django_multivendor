"""
Enhanced pagination for skeleton loader support
"""
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from collections import OrderDict


class SkeletonAwarePagination(PageNumberPagination):
    """
    Pagination class that includes metadata useful for skeleton loaders
    """
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100
    
    def get_paginated_response(self, data):
        """
        Return a paginated response with additional metadata for skeleton loaders
        """
        return Response(OrderDict([
            ('count', self.page.paginator.count),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('results', data),
            ('pagination_info', {
                'current_page': self.page.number,
                'total_pages': self.page.paginator.num_pages,
                'page_size': self.page_size,
                'has_next': self.page.has_next(),
                'has_previous': self.page.has_previous(),
                'start_index': self.page.start_index(),
                'end_index': self.page.end_index(),
            }),
            ('skeleton_count', self.page_size),  # For frontend skeleton loading
            ('loading_state', False)  # Can be used for loading indicators
        ]))
    
    def get_paginated_response_schema(self, schema):
        """
        Schema for the paginated response
        """
        return {
            'type': 'object',
            'properties': {
                'count': {
                    'type': 'integer',
                    'example': 123,
                },
                'next': {
                    'type': 'string',
                    'nullable': True,
                    'format': 'uri',
                    'example': 'http://api.example.org/accounts/?page=4'
                },
                'previous': {
                    'type': 'string',
                    'nullable': True,
                    'format': 'uri',
                    'example': 'http://api.example.org/accounts/?page=2'
                },
                'results': schema,
                'pagination_info': {
                    'type': 'object',
                    'properties': {
                        'current_page': {'type': 'integer'},
                        'total_pages': {'type': 'integer'},
                        'page_size': {'type': 'integer'},
                        'has_next': {'type': 'boolean'},
                        'has_previous': {'type': 'boolean'},
                        'start_index': {'type': 'integer'},
                        'end_index': {'type': 'integer'},
                    }
                },
                'skeleton_count': {'type': 'integer'},
                'loading_state': {'type': 'boolean'}
            },
        }


class OptimizedPagination(PageNumberPagination):
    """
    Optimized pagination for better performance with skeleton loaders
    """
    page_size = 12  # Good for product grids
    page_size_query_param = 'page_size'
    max_page_size = 50
    
    def paginate_queryset(self, queryset, request, view=None):
        """
        Paginate a queryset with optimized queries
        """
        # Add prefetch_related and select_related optimizations
        if hasattr(queryset, 'prefetch_related'):
            # Common optimizations for product queries
            if hasattr(queryset.model, 'vendor'):
                queryset = queryset.select_related('vendor', 'category')
            if hasattr(queryset.model, 'images'):
                queryset = queryset.prefetch_related('images')
        
        return super().paginate_queryset(queryset, request, view)


class InfiniteScrollPagination(PageNumberPagination):
    """
    Pagination optimized for infinite scroll with skeleton loading
    """
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 50
    
    def get_paginated_response(self, data):
        """
        Response format optimized for infinite scroll
        """
        has_next = self.page.has_next() if self.page else False
        next_page = self.page.number + 1 if has_next else None
        
        return Response({
            'results': data,
            'has_next': has_next,
            'next_page': next_page,
            'current_page': self.page.number if self.page else 1,
            'total_count': self.page.paginator.count if self.page else 0,
            'page_size': self.page_size,
            'skeleton_count': self.page_size,  # For loading next batch
        })


class CategoryAwarePagination(PageNumberPagination):
    """
    Pagination that includes category information for better skeleton loading
    """
    page_size = 16  # Good for category grids (4x4)
    page_size_query_param = 'page_size'
    max_page_size = 32
    
    def get_paginated_response(self, data):
        """
        Include category metadata for skeleton loaders
        """
        response_data = OrderDict([
            ('count', self.page.paginator.count),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('results', data),
            ('grid_size', {
                'columns': 4,  # Suggested grid columns
                'rows': 4,     # Suggested grid rows
            }),
            ('skeleton_count', self.page_size)
        ])
        
        return Response(response_data)
