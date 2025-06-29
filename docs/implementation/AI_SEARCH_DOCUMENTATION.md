# AI-Powered Product Search Implementation

## Overview

This implementation provides a complete dual-search system for the Django multivendor e-commerce platform, featuring both AI-powered and ordinary search capabilities fully integrated into the frontend user interface.

## Complete Integration Features

### Dual Search System

- **AI Search**: Natural language queries using Ollama LLM with intelligent tag mapping
- **Ordinary Search**: Traditional keyword-based search with filters and sorting
- **Seamless Switching**: Users can toggle between search types on the same results page
- **Unified Interface**: Both search types accessible from header components

### Frontend Integration

- **Search Results Page**: Displays both AI and ordinary search results with type toggle
- **AI Search Modal**: Quick AI search overlay with instant results preview
- **Search Box**: Traditional search with suggestions and category filtering
- **Cross-Navigation**: Easy switching between search types with preserved queries

## Architecture

### Backend Components

1. **Django App: `ai_search`**

   - Models for search logging, product tags, and search results
   - AI service for intelligent tag-based product search
   - REST API endpoints for frontend integration
   - Management commands for testing and administration

2. **AI Search Service (`ai_search/services.py`)**

   - Ollama integration for AI-powered tag analysis
   - Manual tag selection with concept mapping (fallback)
   - Keyword-based search fallback
   - Caching and performance optimization
   - Comprehensive scoring system

3. **Models (`ai_search/models.py`)**
   - `SearchLog`: Track all search queries and performance
   - `ProductTag`: AI-identified product tags
   - `ProductTagAssociation`: Link products with AI tags and confidence scores
   - `SearchResult`: Store search results for analytics

### Frontend Components

1. **AI Search Modal (`frontend/src/components/Search/AISearchModal.jsx`)**

   - Modern, responsive search interface
   - Real-time search with loading states
   - Product cards with match scores and tags
   - Error handling and retry functionality

2. **AI Search Button**
   - Integrated into header components
   - Animated with AI badge
   - Mobile-responsive design

### DevOps Integration

- **Ollama Server**: Automatically started in `start.bat`
- **Model Management**: Automatic download of AI model (gemma:7b)
- **Health Monitoring**: API endpoints for service health checks
- **Production API**: Configured to use `https://api.bazro.ge` endpoint
- **Development Support**: Fallback to local development servers when needed

### API Configuration

The system is configured to use the production API endpoint:

- **Base URL**: `https://api.bazro.ge`
- **AI Search**: `POST /api/ai/search/`
- **Ordinary Search**: `GET /api/search/`
- **Search Suggestions**: `GET /api/search/suggestions/`
- **Cross-Origin Support**: CORS configured for frontend integration

## Features

### AI-Powered Search

- **Natural Language Queries**: "Show me wireless headphones under $100"
- **Intelligent Tag Mapping**: Converts queries to relevant product tags
- **Concept Understanding**: Maps related concepts (wireless → bluetooth, earbuds)
- **Fallback Mechanisms**: Multiple layers of search fallback

### Search Methods (in order of preference)

1. **AI Tag Analysis**: Uses Ollama LLM to extract relevant tags
2. **Manual Tag Selection**: Rule-based tag mapping with extensive concept dictionary
3. **Keyword Search**: Traditional text-based search as final fallback

### Performance Features

- **Response Caching**: Redis/memory caching for repeated queries
- **Search Analytics**: Track query performance and popular searches
- **Debug Mode**: Detailed logging for troubleshooting

### Frontend Features

- **Live Search**: Real-time search as you type
- **Product Cards**: Rich product display with images, ratings, prices
- **Match Scores**: Show AI confidence in search results
- **Suggestion Chips**: Pre-defined search suggestions
- **Error Recovery**: Graceful handling of API failures

## API Endpoints

### Search API

```
POST /api/ai/search/
Content-Type: application/json

{
    "query": "wireless headphones with good battery",
    "max_results": 20
}
```

**Response:**

```json
{
  "query": "wireless headphones with good battery",
  "results": [
    {
      "id": 1,
      "name": "Sony WH-1000XM4",
      "price": 299.99,
      "old_price": 349.99,
      "vendor_name": "Tech Store",
      "category": "Electronics",
      "thumbnail": "/media/products/sony-headphones.jpg",
      "tags": ["wireless", "noise-cancelling", "long-battery"],
      "rating": 4.5,
      "stock": 15,
      "is_hot": true,
      "match_score": 4.2
    }
  ],
  "total_count": 1,
  "relevant_tags": ["wireless", "headphones", "long-battery"],
  "search_method": "tag_based",
  "response_time_ms": 245
}
```

### Other Endpoints

- `GET /api/ai/suggestions/` - Get search suggestions
- `GET /api/ai/analytics/` - Search analytics data
- `GET /api/ai/health/` - Service health check

## Installation & Setup

### Prerequisites

- Ollama installed and running
- Python packages: `requests`, `django-rest-framework`
- Node.js for frontend

### Backend Setup

1. **Install Ollama Model**:

   ```bash
   ollama pull gemma:7b
   ```

2. **Django Configuration** (in `settings.py`):

   ```python
   INSTALLED_APPS = [
       # ... other apps
       'ai_search',
   ]

   # AI Search Configuration
   OLLAMA_API_URL = 'http://localhost:11434/api/generate'
   OLLAMA_MODEL = 'gemma:7b'
   AI_SEARCH_DEBUG = False  # Set to True for debugging
   AI_SEARCH_CACHE_TIMEOUT = 3600  # 1 hour
   ```

3. **Run Migrations**:
   ```bash
   python manage.py migrate ai_search
   ```

### Frontend Setup

The AI search components are already integrated into the header. No additional setup required.

## Usage

### Frontend User Experience

#### AI Search

1. **Quick Search**: Click the "Ask AI" button in the header for instant AI search modal
2. **Natural Language**: Type queries like "Show me wireless headphones under $100"
3. **Instant Results**: See product results with AI match scores and relevant tags
4. **View All**: Click "View All Results" to see complete results on search page

#### Ordinary Search

1. **Search Box**: Use the main search box in the header
2. **Category Filtering**: Select categories for focused searches
3. **Auto-suggestions**: Get suggestions as you type
4. **Advanced Sorting**: Sort by price, rating, relevance, or date

#### Unified Search Results

1. **Search Page**: Navigate to `/search?q=your-query&type=ai` or `&type=ordinary`
2. **Toggle Between Types**: Switch between AI and ordinary search while keeping your query
3. **Enhanced Display**: See match scores, relevant tags, and detailed product information
4. **Responsive Design**: Optimized for desktop and mobile devices

### Command Line Testing

```bash
# Test search with debug output
python manage.py ai_search "electronics" --debug --max-results 5

# Test tag selection only
python manage.py ai_search "wireless headphones" --tags-only

# Force AI analysis (requires Ollama running)
python manage.py ai_search "gaming laptop" --ai
```

### API Testing

```bash
# Test the integrated APIs
python test_search_apis.py
```

```bash
# Test the API directly
python test_ai_search.py "electronics" 5
```

### Frontend Usage

1. Click the AI search button in the header
2. Type your query in natural language
3. Use suggestion chips for quick searches
4. Click on products to view details

## Configuration

### Debug Mode

Set `AI_SEARCH_DEBUG = True` in settings.py to enable detailed logging:

- Tag selection process
- AI API calls and responses
- Search scoring details
- Performance metrics

### Concept Mappings

The system includes an extensive concept mapping dictionary in `services.py`:

```python
concept_mappings = {
    "wireless": ["wireless", "bluetooth"],
    "headphones": ["headphones", "earbuds", "audio"],
    "gaming": ["gaming", "high-performance"],
    # ... more mappings
}
```

Add more mappings as needed for better search accuracy.

### AI Model Configuration

- **Default Model**: `gemma:7b`
- **Alternative Models**: Can use any Ollama-compatible model
- **Model Selection**: Modify `OLLAMA_MODEL` in settings

## Monitoring & Analytics

### Health Checks

Monitor service health via `/api/ai/health/`:

- Database connectivity
- Ollama server status
- AI model availability
- Search functionality

### Search Analytics

View search statistics via Django admin:

- Popular search queries
- Average response times
- Search success rates
- Tag usage patterns

### Performance Monitoring

- Response time tracking
- Cache hit rates
- Fallback usage statistics
- Error monitoring

## Troubleshooting

### Common Issues

1. **Ollama Not Running**

   - Error: "Connection refused - Ollama server not running"
   - Solution: Start Ollama with `ollama serve` or use `start.bat`

2. **Model Not Available**

   - Error: Model not found
   - Solution: Run `ollama pull gemma:7b`

3. **No Search Results**

   - Check if products have tags
   - Verify tag matching in debug mode
   - Use fallback keyword search

4. **Slow Performance**
   - Enable caching
   - Reduce max_results
   - Check database indexing

### Debug Commands

```bash
# Check service health
curl http://localhost:8000/api/ai/health/

# Test with debug output
python manage.py ai_search "test query" --debug

# Check available tags
python manage.py shell -c "from ai_search.services import ai_search_service; print(ai_search_service.get_all_product_tags())"
```

## Future Enhancements

### Planned Features

- **Machine Learning**: Train custom models on search behavior
- **Personalization**: User-specific search recommendations
- **Multi-language**: Support for multiple languages
- **Voice Search**: Speech-to-text integration
- **Image Search**: Visual product search capabilities

### Performance Improvements

- **Elasticsearch**: Full-text search engine integration
- **Redis Cluster**: Distributed caching
- **CDN Integration**: Static asset optimization
- **Database Optimization**: Advanced indexing strategies

## Contributing

### Adding New Concept Mappings

1. Edit `concept_mappings` in `ai_search/services.py`
2. Test with `--tags-only` flag
3. Verify search results improve

### Adding New Search Methods

1. Implement new method in `OllamaAISearchService`
2. Add to fallback chain in `search_products()`
3. Update health checks and monitoring

### Frontend Enhancements

1. Modify `AISearchModal.jsx` for UI changes
2. Update `AISearchModal.css` for styling
3. Test responsive design on mobile devices

## License

This implementation is part of the Django Multivendor E-commerce Platform.
