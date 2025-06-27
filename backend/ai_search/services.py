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

class OllamaAISearchService:
    """AI-powered product search using Ollama"""
    
    def __init__(self):
        self.ollama_url = getattr(settings, 'OLLAMA_API_URL', 'http://localhost:11434/api/generate')
        self.model_name = getattr(settings, 'OLLAMA_MODEL', 'gemma:7b')
        self.debug_mode = getattr(settings, 'AI_SEARCH_DEBUG', False)
        self.cache_timeout = getattr(settings, 'AI_SEARCH_CACHE_TIMEOUT', 3600)  # 1 hour
        
    def debug_log(self, message: str):
        """Log debug information if debug mode is enabled"""
        if self.debug_mode:
            logger.info(f"[AI_SEARCH_DEBUG] {message}")
    
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
        Manual tag selection based on query analysis (enhanced version)
        Based on the Python script's concept mapping approach
        """
        query_words = user_query.lower().split()
        relevant_tags = []
        
        # Direct matches - look for tags directly mentioned in the query
        for tag in all_tags:
            tag_lower = tag.lower()
            # Check if tag is directly mentioned in the query
            if tag_lower in user_query.lower():
                relevant_tags.append(tag)
                continue
            
            # Check if any query word is in the tag (or vice versa)
            for word in query_words:
                if (word in tag_lower) or (tag_lower in word):
                    if len(word) > 3:  # Only consider meaningful words
                        relevant_tags.append(tag)
                        break
        
        # Enhanced concept mappings (similar to your Python script)
        concept_mappings = {
            "noise cancellation": ["noise-cancelling", "premium", "headphones"],
            "wireless": ["wireless", "bluetooth"],
            "headphones": ["headphones", "earbuds", "audio"],
            "earbuds": ["earbuds", "portable", "wireless"],
            "bluetooth": ["bluetooth", "wireless"],
            "gaming": ["gaming", "high-performance"],
            "cheap": ["budget", "sale", "affordable"],
            "affordable": ["budget", "sale"],
            "budget": ["budget"],
            "high quality": ["premium", "high-resolution"],
            "premium": ["premium"],
            "fast": ["fast-charging", "high-performance"],
            "long battery": ["long-battery", "rechargeable"],
            "durable": ["durable", "rugged"],
            "sports": ["sports", "waterproof", "portable"],
            "kids": ["children", "family"],
            "work": ["professional", "office"],
            "professional": ["professional"],
            "travel": ["travel", "portable", "lightweight"],
            "water resistant": ["waterproof"],
            "waterproof": ["waterproof"],
            "apple": ["apple"],
            "samsung": ["samsung"],
            "sony": ["sony"],
            "bose": ["bose"],
            "loud": ["surround-sound", "high-performance"],
            "powerful": ["high-performance"],
            "4k": ["4k", "ultra-hd"],
            "hd": ["hd", "4k", "ultra-hd"],
            "tv": ["qled", "oled", "smart", "entertainment"],
            "phone": ["smartphone", "5g"],
            "smartphone": ["smartphone"],
            "laptop": ["laptop"],
            "computer": ["laptop"],
            "tablet": ["tablet"],
            "camera": ["camera", "high-resolution"],
            "speaker": ["speaker"],
            "watch": ["watch", "fitness-tracker"],
            "fitness": ["fitness-tracker", "exercise"],
            "keyboard": ["keyboard"],
            "mouse": ["mouse"],
        }
        
        # Concept matches - check if any known concepts are in the query
        concept_matches = []
        for concept, related_tags in concept_mappings.items():
            # Check if the concept appears in the query
            if concept in user_query.lower():
                concept_matches.extend(related_tags)
                continue
                
            # Check for partial word matches
            for word in query_words:
                if (word in concept) or (concept in word):
                    if len(word) > 3:  # Only consider meaningful words
                        concept_matches.extend(related_tags)
                        break
        
        # Combine matches, prioritizing direct matches and removing duplicates
        all_matches = []
        
        # First add direct matches
        for tag in relevant_tags:
            if tag not in all_matches and tag in all_tags:
                all_matches.append(tag)
        
        # Then add concept matches if not already included
        for tag in concept_matches:
            # Find matching tags in our system (case-insensitive)
            matching_tags = [t for t in all_tags if tag.lower() in t.lower()]
            for matching_tag in matching_tags:
                if matching_tag not in all_matches:
                    all_matches.append(matching_tag)
        
        # Log the tag selection process for debugging
        self.debug_log(f"Query words: {query_words}")
        self.debug_log(f"Direct matches: {relevant_tags}")
        self.debug_log(f"Concept matches: {concept_matches}")
        self.debug_log(f"Final selected tags: {all_matches[:10]}")
        
        # Limit to maximum 10 tags
        return all_matches[:10]
    
    def select_relevant_tags_ai(self, user_query: str, all_tags: List[str]) -> List[str]:
        """
        Use AI to select relevant tags from the query
        """
        try:
            prompt = f"""<start_of_turn>user
I need you to analyze a user's product search query and identify which product tags are most relevant.

User search query: "{user_query}"

Available product tags:
{json.dumps(all_tags)}

Please identify the 5-10 most relevant tags that match the user's search intent. Consider:
1. Direct mentions of product types
2. Features or characteristics mentioned
3. Use cases or activities mentioned
4. Technical specifications
5. Implied needs

Respond with only a JSON array of tag names:
["tag1", "tag2", "tag3"]
<end_of_turn>

<start_of_turn>assistant
"""
            
            self.debug_log(f"Sending AI query for tag analysis: {user_query}")
            
            response = requests.post(
                self.ollama_url,
                json={
                    "model": self.model_name,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.2
                    }
                },
                timeout=30
            )
            response.raise_for_status()
            
            ai_response = response.json().get('response', '')
            self.debug_log(f"AI response: {ai_response}")
            
            # Extract JSON array from response
            start_idx = ai_response.find('[')
            end_idx = ai_response.rfind(']') + 1
            
            if start_idx >= 0 and end_idx > start_idx:
                tags_json = ai_response[start_idx:end_idx]
                try:
                    ai_tags = json.loads(tags_json)
                    # Filter to only include tags that exist in our system
                    valid_tags = [tag for tag in ai_tags if tag in all_tags]
                    self.debug_log(f"AI selected tags: {valid_tags}")
                    return valid_tags
                except json.JSONDecodeError:
                    self.debug_log("Failed to parse AI response JSON")
            
        except Exception as e:
            self.debug_log(f"AI tag selection failed: {str(e)}")
        
        return []
    
    def get_products_with_tags(self) -> List[Dict[str, Any]]:
        """
        Get all active products with their tags
        """
        products = []
        
        for product in VendorProduct.objects.filter(stock__gt=0).select_related('vendor', 'category'):
            # Get tags from the tags field
            product_tags = []
            if product.tags:
                product_tags = [tag.strip() for tag in product.tags.split(',') if tag.strip()]
            
            # Get AI tags
            ai_tags = list(product.ai_tags.values_list('tag__name', flat=True))
            all_tags = list(set(product_tags + ai_tags))
            
            product_data = {
                'id': product.id,
                'name': product.name,
                'description': product.description,
                'price': float(product.price),
                'old_price': float(product.old_price) if product.old_price else None,
                'vendor_name': product.vendor.store_name,
                'category': product.category.name if product.category else None,
                'thumbnail': product.thumbnail.url if product.thumbnail else None,
                'tags': all_tags,
                'rating': float(product.rating),
                'stock': product.stock,
                'is_hot': product.is_hot,
            }
            products.append(product_data)
        
        return products
    
    def score_products(self, products: List[Dict], relevant_tags: List[str], query: str) -> List[Dict]:
        """
        Score products based on tag relevance and query matching
        """
        scored_products = []
        query_lower = query.lower()
        
        for product in products:
            score = 0
            
            # Tag matching (highest weight)
            product_tags_lower = [tag.lower() for tag in product['tags']]
            tag_matches = sum(1 for tag in relevant_tags if tag.lower() in product_tags_lower)
            score += tag_matches * 3
            
            # Name matching
            if any(word in product['name'].lower() for word in query_lower.split() if len(word) > 3):
                score += 2
            
            # Description matching
            if product['description'] and any(word in product['description'].lower() for word in query_lower.split() if len(word) > 3):
                score += 1
            
            # Category matching
            if product['category'] and any(word in product['category'].lower() for word in query_lower.split() if len(word) > 3):
                score += 1
            
            # Boost for hot products
            if product['is_hot']:
                score += 0.5
            
            # Boost for products with good ratings
            if product['rating'] >= 4.0:
                score += 0.3
            
            if score > 0:
                product['match_score'] = score
                scored_products.append(product)
        
        # Sort by score (descending)
        scored_products.sort(key=lambda p: p['match_score'], reverse=True)
        return scored_products
    
    def search_products(self, query: str, user_ip: str = None, user_agent: str = '') -> Dict[str, Any]:
        """
        Main search function with AI and fallback mechanisms
        """
        start_time = time.time()
        
        # Check cache first
        query_hash = hashlib.md5(query.lower().strip().encode()).hexdigest()
        cached_result = cache.get(f"ai_search_{query_hash}")
        
        if cached_result:
            self.debug_log(f"Returning cached result for query: {query}")
            return cached_result
        
        try:
            # Log the search
            search_log = SearchLog.objects.create(
                search_query=query,
                user_ip=user_ip,
                user_agent=user_agent
            )
            
            # Get all products and tags
            all_tags = self.get_all_product_tags()
            products = self.get_products_with_tags()
            
            self.debug_log(f"Loaded {len(products)} products and {len(all_tags)} tags")
            
            # Select relevant tags (try AI first, fallback to manual)
            relevant_tags = self.select_relevant_tags_ai(query, all_tags)
            if not relevant_tags:
                relevant_tags = self.select_relevant_tags_manual(query, all_tags)
            
            self.debug_log(f"Selected relevant tags: {relevant_tags}")
            
            # Score and filter products using tag-based approach
            results = self.score_products(products, relevant_tags, query)
            
            # If no results from tag-based search, fall back to keyword search
            if not results:
                self.debug_log("No results from tag-based search, falling back to keyword search")
                results = self.keyword_search_fallback(query)
                search_method = "keyword_fallback"
            else:
                search_method = "tag_based"
                results = results[:20]  # Limit tag-based results
            
            # Calculate response time
            response_time = int((time.time() - start_time) * 1000)
            
            # Update search log
            search_log.results_count = len(results)
            search_log.response_time_ms = response_time
            search_log.save()
            
            # Prepare response
            response_data = {
                'query': query,
                'results': results,
                'total_count': len(results),
                'relevant_tags': relevant_tags,
                'search_method': search_method,
                'response_time_ms': response_time
            }
            
            # Cache the result
            cache.set(f"ai_search_{query_hash}", response_data, self.cache_timeout)
            
            return response_data
            
        except Exception as e:
            logger.error(f"AI search error: {str(e)}")
            
            # As a last resort, try keyword search
            try:
                self.debug_log("Main search failed, attempting keyword fallback")
                fallback_results = self.keyword_search_fallback(query)
                response_time = int((time.time() - start_time) * 1000)
                
                return {
                    'query': query,
                    'results': fallback_results,
                    'total_count': len(fallback_results),
                    'relevant_tags': [],
                    'search_method': "keyword_emergency_fallback",
                    'response_time_ms': response_time,
                    'warning': 'Search service degraded - using basic keyword search'
                }
            except Exception as fallback_error:
                logger.error(f"Fallback search also failed: {str(fallback_error)}")
                return {
                    'query': query,
                    'results': [],
                    'total_count': 0,
                    'relevant_tags': [],
                    'error': str(e),
                    'response_time_ms': int((time.time() - start_time) * 1000)
                }
    
    def keyword_search_fallback(self, query: str) -> List[Dict[str, Any]]:
        """
        Simple keyword-based search as a fallback when tag-based search fails
        """
        self.debug_log(f"Falling back to keyword search for: {query}")
        
        # Break the query into keywords
        keywords = [k.strip().lower() for k in query.split() if len(k.strip()) > 3]
        
        if not keywords:
            return []
        
        products = []
        
        # Get all products and search in name, description, category, and tags
        for product in VendorProduct.objects.filter(stock__gt=0).select_related('vendor', 'category'):
            match_score = 0
            
            # Search in product name (highest weight)
            for keyword in keywords:
                if keyword in product.name.lower():
                    match_score += 3
            
            # Search in description
            if product.description:
                for keyword in keywords:
                    if keyword in product.description.lower():
                        match_score += 2
            
            # Search in category name
            if product.category:
                for keyword in keywords:
                    if keyword in product.category.name.lower():
                        match_score += 1
            
            # Search in tags
            if product.tags:
                product_tags = [tag.strip().lower() for tag in product.tags.split(',') if tag.strip()]
                for keyword in keywords:
                    for tag in product_tags:
                        if keyword in tag:
                            match_score += 2
            
            # If we have a match, add to results
            if match_score > 0:
                # Get tags for display
                product_tags = []
                if product.tags:
                    product_tags = [tag.strip() for tag in product.tags.split(',') if tag.strip()]
                
                # Get AI tags
                ai_tags = list(product.ai_tags.values_list('tag__name', flat=True))
                all_tags = list(set(product_tags + ai_tags))
                
                product_data = {
                    'id': product.id,
                    'name': product.name,
                    'description': product.description,
                    'price': float(product.price),
                    'old_price': float(product.old_price) if product.old_price else None,
                    'vendor_name': product.vendor.store_name,
                    'category': product.category.name if product.category else None,
                    'thumbnail': product.thumbnail.url if product.thumbnail else None,
                    'tags': all_tags,
                    'rating': float(product.rating),
                    'stock': product.stock,
                    'is_hot': product.is_hot,
                    'match_score': match_score,
                }
                products.append(product_data)
        
        # Sort by match score (descending)
        products.sort(key=lambda p: p['match_score'], reverse=True)
        return products[:20]  # Return top 20 results

# Global instance
ai_search_service = OllamaAISearchService()
