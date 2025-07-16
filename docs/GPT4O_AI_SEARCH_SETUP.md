# GPT-4o AI Search Integration

## Overview

Your Django multivendor platform now uses **GPT-4o via GitHub Copilot** instead of Ollama for AI-powered product search. This provides better accuracy, faster responses, and is included in your existing Copilot subscription.

## ✅ What's Already Done

- **Complete GPT-4o Implementation**: Full service in `backend/ai_search/gpt_service.py`
- **API Integration**: GitHub Copilot API with automatic token management
- **Fallback System**: GPT-4o → Manual mapping → Keyword search
- **Same Endpoints**: Your existing frontend will work without changes
- **Better Performance**: Faster and more accurate than Ollama

## 🚀 Quick Setup

### 1. Get Your GitHub Token

1. Go to [GitHub Personal Access Tokens](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. Name it: `Django AI Search`
4. Select scopes:
   - ✅ `repo` (if using private repos)
   - ✅ `read:user`
   - ✅ `user:email`
5. Make sure you have **GitHub Copilot subscription active**
6. Copy the token (starts with `ghp_` or `github_pat_`)

### 2. Configure Token

**Option A: Use the setup script (recommended)**

```bash
python setup_copilot_ai.py
# or on Windows:
setup_copilot_ai.bat
```

**Option B: Manual setup**

```bash
# Create .env file from example
cp .env.example .env

# Edit .env and replace:
GITHUB_TOKEN=your_actual_github_token_here
```

### 3. Test the Integration

```bash
python test_copilot_ai.py
```

## 🔧 Technical Details

### How It Works

1. **Token Exchange**: Your GitHub token → Copilot access token (auto-refreshed)
2. **AI Query**: User search → GPT-4o analysis → Relevant product tags
3. **Product Matching**: Tags → Database query → Scored results
4. **Fallback**: If GPT-4o fails → Manual tag mapping → Keyword search

### API Endpoints (No Changes Needed)

- `POST /api/ai/search/` - AI-powered search (now uses GPT-4o)
- `GET /api/ai/health/` - Service health check
- `GET /api/ai/suggestions/` - Search suggestions

### Configuration Options

In your `.env` file:

```bash
# Required
GITHUB_TOKEN=your_github_token_here

# Optional
AI_SEARCH_DEBUG=True          # Enable debug logging
AI_SEARCH_CACHE_TIMEOUT=3600  # Cache timeout in seconds
```

## 🧪 Testing

### Command Line Test

```bash
# Basic search test
python backend/manage.py ai_search "wireless headphones under 100"

# Debug mode
python backend/manage.py ai_search "electronics" --debug

# Tag extraction only
python backend/manage.py ai_search "gaming laptop" --tags-only
```

### Frontend Test

1. Open your shop at `http://localhost:3000`
2. Click the "AI Search" button in header
3. Try queries like:
   - "wireless headphones under $100"
   - "gaming laptop for students"
   - "home decoration items"

### API Test

```bash
curl -X POST http://localhost:8000/api/ai/search/ \
  -H "Content-Type: application/json" \
  -d '{"query": "electronics under 50 dollars"}'
```

## 📊 Benefits vs Ollama

| Feature         | Ollama (Old)                | GPT-4o (New)                |
| --------------- | --------------------------- | --------------------------- |
| **Setup**       | Complex local installation  | Simple token setup          |
| **Performance** | Slower, local processing    | Faster, cloud-based         |
| **Accuracy**    | Good, but limited           | Excellent, state-of-the-art |
| **Maintenance** | Model updates, disk space   | Zero maintenance            |
| **Cost**        | Free but resource-intensive | Included in Copilot         |
| **Reliability** | Depends on local setup      | Enterprise-grade uptime     |

## 🔍 How Search Works Now

### Example Query: "wireless bluetooth headphones under $50"

1. **GPT-4o Analysis**:

   ```
   Input: "wireless bluetooth headphones under $50"
   Output: ["wireless", "bluetooth", "headphones", "audio", "portable"]
   ```

2. **Product Matching**:

   - Finds products with matching tags
   - Scores by relevance, price, rating
   - Filters by price range if mentioned

3. **Results**:
   ```json
   {
     "query": "wireless bluetooth headphones under $50",
     "results": [...],
     "search_method": "gpt4o",
     "relevant_tags": ["wireless", "bluetooth", "headphones"],
     "response_time_ms": 245
   }
   ```

## 🛠️ Troubleshooting

### Common Issues

1. **"No GitHub token found"**

   - Run `python setup_copilot_ai.py`
   - Verify token in `.env` file

2. **"Failed to acquire Copilot token"**

   - Check your GitHub Copilot subscription
   - Verify token permissions
   - Check if token is expired

3. **"Fallback to manual search"**
   - Normal behavior if GPT-4o is temporarily unavailable
   - Search still works with manual tag mapping

### Debug Mode

Enable debug logging:

```bash
# In .env
AI_SEARCH_DEBUG=True

# In Django logs, you'll see:
[AI_SEARCH_DEBUG] Starting AI search for query: 'electronics'
[AI_SEARCH_DEBUG] GPT-4o selected tags: ['electronics', 'gadgets', 'tech']
```

## 🚀 Next Steps

1. **Set up your token** using the setup script
2. **Test the integration** with the test script
3. **Try AI search** in your frontend
4. **Monitor performance** in Django admin

Your AI search is now powered by GPT-4o and ready to provide amazing results! 🎉
