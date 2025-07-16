import requests
import json
import hashlib
import logging
import time
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from django.conf import settings
from django.utils import timezone
from django.db.models import Q, Count
from django.core.cache import cache

from vendors.models import VendorProduct
from .models import SearchLog, ProductTag, ProductTagAssociation, SearchResult

logger = logging.getLogger(__name__)

class GPTAISearchService:
    """AI-powered product search using GPT-4o via GitHub Copilot API"""
    
    def __init__(self):
        # GitHub Copilot API settings
        self.api_url = "https://api.github.com/copilot_internal/v2/token"
        self.chat_url = "https://copilot-proxy.githubusercontent.com/v1/chat/completions"
        
        # Get GitHub token from settings
        self.github_token = getattr(settings, 'GITHUB_TOKEN', None)
        if not self.github_token:
            logger.warning("GitHub token not found. AI search will use fallback methods.")
        
        self.debug_mode = getattr(settings, 'AI_SEARCH_DEBUG', False)
        self.cache_timeout = getattr(settings, 'AI_SEARCH_CACHE_TIMEOUT', 3600)  # 1 hour
        self._copilot_token = None
        self._token_expires_at = None
        
    def debug_log(self, message: str):
        """Log debug information if debug mode is enabled"""
        if self.debug_mode:
            logger.info(f"[AI_SEARCH_DEBUG] {message}")
    
    def get_copilot_token(self) -> Optional[str]:
        """Get or refresh Copilot access token"""
        if not self.github_token:
            return None
            
        # Check if we have a valid token
        if self._copilot_token and self._token_expires_at and datetime.now() < self._token_expires_at:
            return self._copilot_token
        
        try:
            headers = {
                'Authorization': f'token {self.github_token}',
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Django-AI-Search/1.0'
            }
            
            response = requests.post(self.api_url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                self._copilot_token = data.get('token')
                # Set expiry to 50 minutes (tokens usually last 1 hour)
                self._token_expires_at = datetime.now() + timedelta(minutes=50)
                return self._copilot_token
            else:
                logger.error(f"Failed to get Copilot token: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            logger.error(f"Error getting Copilot token: {str(e)}")
            return None
    
    def query_gpt4o(self, prompt: str) -> Optional[str]:
        """Query GPT-4o via GitHub Copilot API"""
        copilot_token = self.get_copilot_token()
        if not copilot_token:
            self.debug_log("No Copilot token available, falling back to manual search")
            return None
        
        try:
            headers = {
                'Authorization': f'Bearer {copilot_token}',
                'Content-Type': 'application/json',
                'User-Agent': 'Django-AI-Search/1.0'
            }
            
            payload = {
                "model": "gpt-4o",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are an expert e-commerce product search assistant. Extract relevant product tags and keywords from user queries to help find products in an online marketplace."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "max_tokens": 200,
                "temperature": 0.3
            }
            
            response = requests.post(self.chat_url, headers=headers, json=payload, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                if 'choices' in data and len(data['choices']) > 0:
                    return data['choices'][0]['message']['content'].strip()
                else:
                    logger.error("No choices in GPT-4o response")
                    return None
            else:
                logger.error(f"GPT-4o API error: {response.status_code} - {response.text}")
                return None
                
        except requests.exceptions.RequestException as e:
            logger.error(f"GPT-4o connection error: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"GPT-4o query error: {str(e)}")
            return None
    
    def get_all_product_tags(self) -> List[str]:
        """Get all available product tags from various sources"""
        tags = set()
        
        # Get tags from VendorProduct.tags field (comma-separated)
        products_with_tags = VendorProduct.objects.exclude(tags='').values_list('tags', flat=True)
        for tag_string in products_with_tags:
            if tag_string:
                product_tags = [tag.strip() for tag in tag_string.split(',') if tag.strip()]
                tags.update(product_tags)
        
        # Get tags from ProductTag model
        ai_tags = ProductTag.objects.values_list('name', flat=True)
        tags.update(ai_tags)
        
        # Get category names as potential tags
        from categories.models import Category
        categories = Category.objects.values_list('name', flat=True)
        tags.update(categories)
        
        return sorted(list(tags))
    
    def select_relevant_tags_manual(self, user_query: str, all_tags: List[str]) -> List[str]:
        """
        Manual tag selection based on query analysis (enhanced fallback)
        """
        query_words = user_query.lower().split()
        relevant_tags = []
        
        # Direct matches - look for tags directly mentioned in the query
        for tag in all_tags:
            tag_lower = tag.lower()
            if tag_lower in user_query.lower():
                relevant_tags.append(tag)
                continue
            
            # Check individual words
            for word in query_words:
                if word in tag_lower or tag_lower in word:
                    relevant_tags.append(tag)
                    break
        
        # Concept mapping for common terms
        concept_mappings = {
            'phone': ['smartphone', 'mobile', 'cellular', 'iphone', 'android'],
            'computer': ['laptop', 'desktop', 'pc', 'macbook', 'tablet'],
            'clothes': ['clothing', 'fashion', 'shirt', 'pants', 'dress', 'apparel'],
            'shoes': ['footwear', 'sneakers', 'boots', 'sandals', 'heels'],
            'house': ['home', 'furniture', 'decor', 'kitchen', 'bedroom'],
            'car': ['automotive', 'vehicle', 'auto', 'parts'],
            'baby': ['infant', 'children', 'kids', 'toddler'],
            'beauty': ['cosmetics', 'makeup', 'skincare', 'perfume'],
            'sports': ['fitness', 'exercise', 'gym', 'athletic', 'workout'],
            'book': ['reading', 'literature', 'novel', 'textbook'],
            'music': ['audio', 'headphones', 'speakers', 'instrument'],
            'garden': ['outdoor', 'plants', 'tools', 'lawn'],
            'pet': ['animal', 'dog', 'cat', 'pet supplies']
        }
        
        for keyword, related_tags in concept_mappings.items():
            if keyword in user_query.lower():
                for related_tag in related_tags:
                    if related_tag in [tag.lower() for tag in all_tags]:
                        relevant_tags.append(related_tag)
        
        # Remove duplicates and return top 10
        return list(set(relevant_tags))[:10]
    
    def select_relevant_tags_ai(self, user_query: str, all_tags: List[str]) -> List[str]:
        """Use GPT-4o to select relevant tags from the query"""
        
        # Create a sample of tags to avoid token limits
        tag_sample = all_tags[:100] if len(all_tags) > 100 else all_tags
        
        prompt = f"""
Analyze this product search query and select the most relevant tags from the available options.

Search Query: "{user_query}"

Available Tags: {', '.join(tag_sample)}

Instructions:
1. Select only the tags that are directly relevant to the search query
2. Consider synonyms and related concepts
3. Return ONLY a comma-separated list of selected tags
4. Maximum 10 tags
5. Do not add any explanations or extra text

Example:
Query: "comfortable running shoes under $100"
Response: running, shoes, sneakers, sports, athletic, footwear

Your response:"""

        ai_response = self.query_gpt4o(prompt)
        
        if ai_response:
            # Clean and extract tags
            selected_tags = []
            for tag in ai_response.split(','):
                tag = tag.strip()
                # Only include tags that exist in our available tags
                if tag in all_tags:
                    selected_tags.append(tag)
            
            self.debug_log(f"GPT-4o selected tags: {selected_tags}")
            return selected_tags[:10]
        
        return []
    
    def get_products_with_tags(self) -> List[Dict[str, Any]]:
        """Get all products with their associated tags for scoring"""
        products = VendorProduct.objects.filter(stock__gt=0).select_related('category', 'vendor')
        
        product_list = []
        for product in products:
            # Combine all tags from different sources
            all_tags = []
            
            # Product tags field
            if product.tags:
                all_tags.extend([tag.strip() for tag in product.tags.split(',') if tag.strip()])
            
            # Category name
            if product.category:
                all_tags.append(product.category.name)
            
            # AI tags from ProductTag model
            ai_tags = ProductTagAssociation.objects.filter(product=product).select_related('tag')
            for association in ai_tags:
                all_tags.append(association.tag.name)
            
            product_data = {
                'id': product.id,
                'name': product.name,
                'description': product.description,
                'brand': product.brand,
                'price': float(product.price),
                'tags': list(set(all_tags)),  # Remove duplicates
                'rating': product.rating,
                'is_hot': product.is_hot,
                'category': product.category.name if product.category else '',
                'vendor': product.vendor.store_name if product.vendor else '',
                'stock': product.stock
            }
            product_list.append(product_data)
        
        return product_list
    
    def score_products(self, products: List[Dict], relevant_tags: List[str], query: str) -> List[Dict]:
        """Score products based on tag relevance and other factors"""
        scored_products = []
        query_words = query.lower().split()
        
        for product in products:
            score = 0
            matched_tags = []
            
            # Tag matching (highest weight)
            for tag in relevant_tags:
                tag_lower = tag.lower()
                if tag_lower in [t.lower() for t in product['tags']]:
                    score += 15
                    matched_tags.append(tag)
            
            # Direct text matching
            product_text = f"{product['name']} {product['description']} {product['brand']}".lower()
            
            for word in query_words:
                if word in product_text:
                    score += 5
            
            # Name exact matches get highest priority
            if any(word in product['name'].lower() for word in query_words):
                score += 20
            
            # Brand matching
            if any(word in product['brand'].lower() for word in query_words):
                score += 10
            
            # Category matching
            if any(word in product['category'].lower() for word in query_words):
                score += 8
            
            # Boost for quality indicators
            if product['rating'] > 4.0:
                score += 3
            if product['is_hot']:
                score += 5
            if product['stock'] > 10:
                score += 1
            
            # Only include products with some relevance
            if score > 0:
                product['match_score'] = score
                product['matched_tags'] = matched_tags
                scored_products.append(product)
        
        # Sort by score
        scored_products.sort(key=lambda x: x['match_score'], reverse=True)
        return scored_products
    
    def search_products(self, query: str, user_ip: str = None, user_agent: str = '') -> Dict[str, Any]:
        """Main search method using GPT-4o for tag analysis"""
        start_time = time.time()
        
        try:
            self.debug_log(f"Starting AI search for query: '{query}'")
            
            # Get all available tags
            all_tags = self.get_all_product_tags()
            self.debug_log(f"Found {len(all_tags)} available tags")
            
            # Try AI tag selection first
            relevant_tags = self.select_relevant_tags_ai(query, all_tags)
            search_method = 'gpt4o'
            
            # Fallback to manual if AI fails
            if not relevant_tags:
                self.debug_log("GPT-4o tag selection failed, using manual fallback")
                relevant_tags = self.select_relevant_tags_manual(query, all_tags)
                search_method = 'manual'
            
            self.debug_log(f"Selected relevant tags: {relevant_tags}")
            
            if relevant_tags:
                # Get products and score them
                products = self.get_products_with_tags()
                scored_products = self.score_products(products, relevant_tags, query)
                
                # Limit results
                results = scored_products[:20]
            else:
                # Final fallback: keyword search
                self.debug_log("No relevant tags found, using keyword fallback")
                results = self.keyword_search_fallback(query)
                search_method = 'keyword'
            
            response_time = round((time.time() - start_time) * 1000)
            
            # Log the search
            SearchLog.objects.create(
                search_query=query,
                results_count=len(results),
                user_ip=user_ip,
                user_agent=user_agent,
                response_time_ms=response_time
            )
            
            return {
                'query': query,
                'results': results,
                'total_count': len(results),
                'relevant_tags': relevant_tags,
                'search_method': search_method,
                'response_time_ms': response_time
            }
            
        except Exception as e:
            logger.error(f"AI search failed: {str(e)}")
            return {
                'query': query,
                'results': [],
                'total_count': 0,
                'relevant_tags': [],
                'search_method': 'error',
                'response_time_ms': round((time.time() - start_time) * 1000),
                'error': str(e)
            }
    
    def keyword_search_fallback(self, query: str) -> List[Dict[str, Any]]:
        """Fallback keyword search when AI methods fail"""
        products = VendorProduct.objects.filter(
            Q(name__icontains=query) |
            Q(description__icontains=query) |
            Q(brand__icontains=query) |
            Q(tags__icontains=query),
            stock__gt=0
        ).select_related('category', 'vendor')[:20]
        
        results = []
        for product in products:
            results.append({
                'id': product.id,
                'name': product.name,
                'description': product.description,
                'brand': product.brand,
                'price': float(product.price),
                'rating': product.rating,
                'is_hot': product.is_hot,
                'category': product.category.name if product.category else '',
                'vendor': product.vendor.store_name if product.vendor else '',
                'stock': product.stock,
                'match_score': 1.0,  # Basic relevance score
                'matched_tags': []
            })
        
        return results

# Global instance
gpt_ai_search_service = GPTAISearchService()
