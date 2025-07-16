# 🛠️ Setup Scripts for Django Multivendor

This directory contains setup scripts to configure your Django Multivendor platform.

## 🤖 AI Search Setup

### Quick Setup (Recommended)

**Linux/Mac:**

```bash
bash setup/setup_ai_search.sh
```

**Windows:**

```cmd
setup\setup_ai_search.bat
```

This single script will:

- ✅ Configure GitHub Copilot API access
- ✅ Set up environment variables
- ✅ Test AI search functionality
- ✅ Provide debugging information

### Requirements

1. **GitHub Account** with active Copilot subscription
2. **GitHub Token** with these scopes:
   - `read:user`
   - `user:email`
   - `copilot` (if available)

### What It Does

The setup script configures your platform to use **GPT-4o AI search** via GitHub Copilot API. This enables:

- 🔍 **Intelligent product search** with natural language queries
- 🏷️ **Automatic tag generation** for products
- 📊 **Semantic search results** ranked by relevance
- 🔄 **Fallback systems** (manual → keyword search)

### API Endpoints

After setup, these endpoints will be available:

- `POST /api/ai/search/` - AI-powered product search
- `GET /api/ai/health/` - Service health check

### Troubleshooting

1. **Token Issues**: Verify your GitHub Copilot subscription is active
2. **Service Errors**: Check Django logs with `AI_SEARCH_DEBUG=True`
3. **API Errors**: Ensure your GitHub token has correct scopes

---

## 📁 Directory Structure

```
setup/
├── setup_ai_search.sh    # Main Linux/Mac setup script
├── setup_ai_search.bat   # Main Windows setup script
├── ai_search/            # Legacy files (will be removed)
└── README.md             # This file
```

## 🧹 Cleanup

The `ai_search/` subdirectory contains legacy setup files that are being consolidated. These will be removed in future versions.This directory contains setup and configuration scripts for the Django Multivendor platform.

## 📁 Directory Structure

```
setup/
├── README.md                    # This file
└── ai_search/                   # AI Search setup scripts
    ├── setup_copilot_ai.py      # Python setup script for GitHub Copilot AI
    ├── setup_copilot_ai.bat     # Windows batch setup script
    ├── setup_github_token.sh    # Linux/Mac shell setup script
    └── setup_github_token.bat   # Windows batch token setup script
```

## 🚀 AI Search Setup

The AI search system uses GitHub Copilot API to provide GPT-4o powered product search.

### Quick Setup (Windows)

```bash
cd setup/ai_search
setup_copilot_ai.bat
```

### Quick Setup (Linux/Mac)

```bash
cd setup/ai_search
./setup_github_token.sh
```

### Manual Setup (Python)

```bash
cd setup/ai_search
python setup_copilot_ai.py
```

## ⚙️ What These Scripts Do

1. **Create/Update .env file** with GitHub token configuration
2. **Test GitHub Copilot API access** to ensure your token works
3. **Verify AI search service** is properly configured
4. **Provide troubleshooting guidance** if setup fails

## 📋 Requirements

- GitHub account with Copilot subscription
- GitHub personal access token with proper scopes:
  - `read:user`
  - `user:email`
  - `repo` (if using private repositories)

## 🔧 Usage

After running setup:

1. Restart your Django development server
2. Test AI search in the frontend
3. Check `/api/ai/search/` endpoint is working
4. Monitor logs for any authentication issues

## 🆘 Troubleshooting

- **Token errors**: Ensure your GitHub token has Copilot access
- **API errors**: Check GitHub Copilot subscription status
- **Permission errors**: Verify token scopes include required permissions
- **Connection errors**: Ensure Django server is running and accessible

For detailed troubleshooting, see the main project documentation.
