"""
Django management command for AI-powered product search
Similar to the Python script provided by the user
"""

from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
import os
import sys
from ai_search.services import ai_search_service


class Command(BaseCommand):
    help = 'AI-powered product search command line interface'

    def add_arguments(self, parser):
        parser.add_argument(
            'query',
            type=str,
            help='The search query'
        )
        parser.add_argument(
            '--debug',
            action='store_true',
            help='Enable debug mode'
        )
        parser.add_argument(
            '--ai',
            action='store_true',
            help='Force enable AI tag analysis (requires Ollama)'
        )
        parser.add_argument(
            '--tags-only',
            action='store_true',
            help='Only show selected tags without search results'
        )
        parser.add_argument(
            '--max-results',
            type=int,
            default=10,
            help='Maximum number of results to display (default: 10)'
        )

    def handle(self, *args, **options):
        query = options['query']
        debug_mode = options['debug']
        enable_ai = options['ai']
        tags_only = options['tags_only']
        max_results = options['max_results']

        # Set debug mode if requested
        if debug_mode:
            # Temporarily enable debug for this search
            original_debug = settings.AI_SEARCH_DEBUG
            settings.AI_SEARCH_DEBUG = True
            ai_search_service.debug_mode = True

        try:
            self.stdout.write(
                self.style.SUCCESS(f'Searching for products matching: {query}')
            )

            if tags_only:
                # Just show the tag selection process
                all_tags = ai_search_service.get_all_product_tags()
                
                if enable_ai:
                    selected_tags = ai_search_service.select_relevant_tags_ai(query, all_tags)
                    if not selected_tags:
                        selected_tags = ai_search_service.select_relevant_tags_manual(query, all_tags)
                        self.stdout.write(
                            self.style.WARNING('AI tag selection failed, using manual selection')
                        )
                else:
                    selected_tags = ai_search_service.select_relevant_tags_manual(query, all_tags)
                
                self.stdout.write(f'\nQuery: {query}')
                self.stdout.write(f'Selected tags: {", ".join(selected_tags)}')
                return

            # Perform the full search
            results = ai_search_service.search_products(query)

            if results.get('error'):
                raise CommandError(f'Search failed: {results["error"]}')

            if results.get('warning'):
                self.stdout.write(
                    self.style.WARNING(f'Warning: {results["warning"]}')
                )

            products = results['results'][:max_results]
            total_count = results['total_count']
            relevant_tags = results.get('relevant_tags', [])
            search_method = results.get('search_method', 'unknown')
            response_time = results.get('response_time_ms', 0)

            if products:
                self.stdout.write(
                    self.style.SUCCESS(f'\nFound {total_count} matching products (showing {len(products)}):')
                )
                self.stdout.write(f'Search method: {search_method}')
                self.stdout.write(f'Response time: {response_time}ms')
                
                if relevant_tags:
                    self.stdout.write(f'Relevant tags: {", ".join(relevant_tags)}')

                # Print results in a user-friendly format
                for i, product in enumerate(products, 1):
                    match_score = product.get('match_score', 0)
                    price_display = f"${product['price']:.2f}"
                    
                    if product.get('old_price') and product['old_price'] > product['price']:
                        price_display += f" (was ${product['old_price']:.2f})"
                    
                    self.stdout.write(f"\n{i}. {product['name']} - {price_display}")
                    
                    if match_score:
                        self.stdout.write(f"   Match score: {match_score}")
                    
                    self.stdout.write(f"   Vendor: {product['vendor_name']}")
                    self.stdout.write(f"   Category: {product['category']}")
                    self.stdout.write(f"   Rating: {product['rating']:.1f}")
                    
                    if product.get('description'):
                        # Truncate description for display
                        desc = product['description'][:100]
                        if len(product['description']) > 100:
                            desc += "..."
                        self.stdout.write(f"   Description: {desc}")
                    
                    if product.get('tags'):
                        self.stdout.write(f"   Tags: {', '.join(product['tags'])}")

            else:
                self.stdout.write(
                    self.style.WARNING('No matching products found.')
                )
                self.stdout.write('Try adjusting your search terms or check the suggestions.')

        except Exception as e:
            raise CommandError(f'Search command failed: {str(e)}')

        finally:
            # Restore original debug setting
            if debug_mode:
                settings.AI_SEARCH_DEBUG = original_debug
                ai_search_service.debug_mode = original_debug

        self.stdout.write(
            self.style.SUCCESS('\nSearch completed successfully!')
        )
