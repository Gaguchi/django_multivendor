#!/bin/bash
# 🤖 GPT-4o AI Search Setup for Django Multivendor
# This is the ONE and ONLY setup script you need for AI search functionality

echo "🚀 GPT-4o AI Search Setup for Django Multivendor"
echo "================================================"
echo "This script will set up your AI search powered by GitHub Copilot"
echo

# Check if we're in the correct directory
if [ ! -f "manage.py" ] && [ ! -d "backend" ]; then
    echo "❌ Please run this script from the Django project root directory"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    touch .env
    echo "# Django Multivendor AI Search Configuration" >> .env
    echo "DEBUG=True" >> .env
    echo "SECRET_KEY=your_secret_key_here" >> .env
    echo "" >> .env
fi

echo "📋 GitHub Copilot Setup"
echo "======================="
echo "You need a GitHub token with Copilot access for AI search."
echo
echo "Steps to get your GitHub token:"
echo "1. Go to https://github.com/settings/tokens"
echo "2. Click 'Generate new token (classic)'"
echo "3. Select the following scopes:"
echo "   ✓ read:user"
echo "   ✓ user:email"
echo "   ✓ copilot (if available)"
echo "4. Make sure you have an active GitHub Copilot subscription"
echo "5. Copy the generated token"
echo

read -p "Enter your GitHub token: " GITHUB_TOKEN

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ No token provided. Exiting..."
    exit 1
fi

# Update .env file
if grep -q "GITHUB_TOKEN" .env; then
    # Update existing token
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/GITHUB_TOKEN=.*/GITHUB_TOKEN=$GITHUB_TOKEN/" .env
    else
        # Linux/Windows
        sed -i "s/GITHUB_TOKEN=.*/GITHUB_TOKEN=$GITHUB_TOKEN/" .env
    fi
    echo "✅ Updated GitHub token in .env file"
else
    # Add new token
    echo "" >> .env
    echo "# GitHub Copilot Configuration" >> .env
    echo "GITHUB_TOKEN=$GITHUB_TOKEN" >> .env
    echo "AI_SEARCH_DEBUG=True" >> .env
    echo "AI_SEARCH_CACHE_TIMEOUT=3600" >> .env
    echo "✅ Added GitHub token and AI search config to .env file"
fi

echo
echo "🧪 Testing AI Search Service..."
echo "==============================="

# Test the service
cd backend
python -c "
import os
import sys
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_multivendor.settings')
django.setup()

from ai_search.gpt_service import GPTAISearchService

print('🔍 Initializing AI search service...')
service = GPTAISearchService()

if service.github_token:
    print('✅ GitHub token loaded successfully')
    print('🚀 Testing Copilot token acquisition...')
    token = service.get_copilot_token()
    if token:
        print('✅ Copilot token acquired successfully!')
        print('🎉 GPT-4o AI search is ready to use!')
    else:
        print('❌ Failed to acquire Copilot token')
        print('   Please check your GitHub token and Copilot access')
else:
    print('❌ GitHub token not found')
    print('   Please check your .env file')
"

cd ..

echo
echo "🎯 Setup Complete!"
echo "=================="
echo "Your AI search is now configured with GPT-4o via GitHub Copilot."
echo
echo "🔧 Next Steps:"
echo "1. Start your Django server: cd backend && python manage.py runserver"
echo "2. Test the AI search in your frontend application"
echo "3. Monitor the AI search logs for debugging"
echo
echo "📚 API Endpoints:"
echo "• POST /api/ai/search/ - AI-powered product search"
echo "• GET /api/ai/health/ - Check AI service health"
echo
echo "🐛 Debugging:"
echo "• Set AI_SEARCH_DEBUG=True in .env for detailed logs"
echo "• Check Django logs for AI search activity"
echo "• Verify your GitHub Copilot subscription is active"
echo
echo "✨ Happy searching with GPT-4o! 🤖"
