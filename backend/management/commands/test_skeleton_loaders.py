"""
Management command to test API skeleton loaders
Usage: python manage.py test_skeleton_loaders
"""
from django.core.management.base import BaseCommand
from django.http import JsonResponse
from utils.skeleton_helpers import SkeletonResponse


class Command(BaseCommand):
    help = 'Test skeleton loaders for API responses'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--type',
            type=str,
            default='all',
            choices=['products', 'orders', 'categories', 'vendors', 'all'],
            help='Type of skeleton data to generate'
        )
        parser.add_argument(
            '--count',
            type=int,
            default=10,
            help='Number of skeleton items to generate'
        )
    
    def handle(self, *args, **options):
        skeleton_type = options['type']
        count = options['count']
        
        self.stdout.write(
            self.style.SUCCESS(f'Generating {count} skeleton items of type: {skeleton_type}')
        )
        
        if skeleton_type == 'products' or skeleton_type == 'all':
            products = SkeletonResponse.product_skeleton(count)
            self.stdout.write('Products skeleton data:')
            self.stdout.write(str(products[:2]))  # Show first 2 items
            
        if skeleton_type == 'orders' or skeleton_type == 'all':
            orders = SkeletonResponse.order_skeleton(count)
            self.stdout.write('Orders skeleton data:')
            self.stdout.write(str(orders[:2]))
            
        if skeleton_type == 'categories' or skeleton_type == 'all':
            categories = SkeletonResponse.category_skeleton(count)
            self.stdout.write('Categories skeleton data:')
            self.stdout.write(str(categories[:2]))
            
        if skeleton_type == 'vendors' or skeleton_type == 'all':
            vendors = SkeletonResponse.vendor_skeleton(count)
            self.stdout.write('Vendors skeleton data:')
            self.stdout.write(str(vendors[:2]))
        
        self.stdout.write(
            self.style.SUCCESS('Successfully generated skeleton data!')
        )
