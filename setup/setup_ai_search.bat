@echo off
REM 🤖 GPT-4o AI Search Setup for Django Multivendor (Windows)
REM This is the ONE and ONLY setup script you need for AI search functionality

echo 🚀 GPT-4o AI Search Setup for Django Multivendor
echo ================================================
echo This script will set up your AI search powered by GitHub Copilot
echo.

REM Check if we're in the correct directory
if not exist "backend" (
    if not exist "manage.py" (
        echo ❌ Please run this script from the Django project root directory
        pause
        exit /b 1
    )
)

REM Check if .env file exists
if not exist ".env" (
    echo 📝 Creating .env file...
    echo # Django Multivendor AI Search Configuration > .env
    echo DEBUG=True >> .env
    echo SECRET_KEY=your_secret_key_here >> .env
    echo. >> .env
)

echo 📋 GitHub Copilot Setup
echo =======================
echo You need a GitHub token with Copilot access for AI search.
echo.
echo Steps to get your GitHub token:
echo 1. Go to https://github.com/settings/tokens
echo 2. Click 'Generate new token (classic)'
echo 3. Select the following scopes:
echo    ✓ read:user
echo    ✓ user:email
echo    ✓ copilot (if available)
echo 4. Make sure you have an active GitHub Copilot subscription
echo 5. Copy the generated token
echo.

set /p GITHUB_TOKEN="Enter your GitHub token: "

if "%GITHUB_TOKEN%"=="" (
    echo ❌ No token provided. Exiting...
    pause
    exit /b 1
)

REM Update .env file
findstr /C:"GITHUB_TOKEN" .env >nul 2>&1
if %errorlevel%==0 (
    REM Update existing token (simple approach for Windows)
    echo ⚠️  Please manually update GITHUB_TOKEN in .env file
    echo    Set GITHUB_TOKEN=%GITHUB_TOKEN%
) else (
    REM Add new token
    echo. >> .env
    echo # GitHub Copilot Configuration >> .env
    echo GITHUB_TOKEN=%GITHUB_TOKEN% >> .env
    echo AI_SEARCH_DEBUG=True >> .env
    echo AI_SEARCH_CACHE_TIMEOUT=3600 >> .env
    echo ✅ Added GitHub token and AI search config to .env file
)

echo.
echo 🧪 Testing AI Search Service...
echo ===============================

REM Test the service
cd backend
python -c "import os; import sys; import django; os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_multivendor.settings'); django.setup(); from ai_search.gpt_service import GPTAISearchService; service = GPTAISearchService(); print('✅ GitHub token loaded successfully' if service.github_token else '❌ GitHub token not found'); token = service.get_copilot_token() if service.github_token else None; print('✅ Copilot token acquired successfully!' if token else '❌ Failed to acquire Copilot token')"

cd ..

echo.
echo 🎯 Setup Complete!
echo ==================
echo Your AI search is now configured with GPT-4o via GitHub Copilot.
echo.
echo 🔧 Next Steps:
echo 1. Start your Django server: cd backend ^&^& python manage.py runserver
echo 2. Test the AI search in your frontend application
echo 3. Monitor the AI search logs for debugging
echo.
echo 📚 API Endpoints:
echo • POST /api/ai/search/ - AI-powered product search
echo • GET /api/ai/health/ - Check AI service health
echo.
echo 🐛 Debugging:
echo • Set AI_SEARCH_DEBUG=True in .env for detailed logs
echo • Check Django logs for AI search activity
echo • Verify your GitHub Copilot subscription is active
echo.
echo ✨ Happy searching with GPT-4o! 🤖
pause
