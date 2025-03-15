REM filepath: /e:/Work/WebDev/django_multivendor/start-with-cloudflare.bat
@echo off
echo Starting Django Multivendor with Cloudflare Tunnel

REM Check if cloudflared is installed
where cloudflared >nul 2>&1
if %errorlevel% neq 0 (
    echo Cloudflared is not installed or not in PATH
    echo Please install Cloudflared from https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
    exit /b 1
)

REM Start Django and React in background
start cmd /c "cd backend && echo Starting Django server... && python manage.py runserver"
start cmd /c "cd frontend && echo Starting React server... && npm run dev"

REM Wait for services to start
echo Waiting for services to start...
timeout /t 5 /nobreak

REM Run cloudflared tunnel
echo Starting Cloudflare Tunnel...
cloudflared tunnel --config cloudflared-config.yml run django-multivendor

REM Keep the window open if there's an error
if %errorlevel% neq 0 (
    echo Cloudflared tunnel failed to start
    pause
)