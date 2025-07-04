@echo off
echo Starting Django Multivendor Services...

:: Define project paths
set PROJECT_ROOT=E:\Work\WebDev\django_multivendor
set BACKEND_DIR=%PROJECT_ROOT%\backend
set FRONTEND_DIR=%PROJECT_ROOT%\frontend
set FRONTEND_ADMIN_DIR=%PROJECT_ROOT%\vendor_dashboard
set CLOUDFLARED_CONFIG=%PROJECT_ROOT%\cloudflare\cloudflared-config.yml

:: Check if cloudflared-config.yml exists
if not exist "%CLOUDFLARED_CONFIG%" (
    echo ERROR: cloudflared-config.yml not found at %CLOUDFLARED_CONFIG%
    echo Please create the configuration file in the cloudflare folder before running this script.
    pause
    exit /b 1
)

:: Start Ollama server
echo Starting Ollama server for AI search...
start cmd /k "title Ollama AI Server && echo Starting Ollama AI server... && ollama serve"

:: Wait for Ollama to initialize
timeout /t 3 /nobreak > nul

:: Pull the AI model if not already available (runs in background)
echo Checking/downloading AI model (mistral)...
start cmd /c "ollama pull mistral"

:: Start Django backend server
echo Starting Django backend server...
start cmd /k "title Django Backend && echo Starting Django backend... && cd /d %BACKEND_DIR% && py manage.py runserver"

:: Wait for backend to initialize
timeout /t 5 /nobreak > nul

:: Start frontend
echo Starting customer frontend...
start cmd /k "title Customer Frontend && echo Starting customer frontend... && cd /d %FRONTEND_DIR% && npm run dev"

:: Wait for frontend to initialize
timeout /t 5 /nobreak > nul

:: Start vendor dashboard
echo Starting vendor dashboard...
start cmd /k "title Vendor dashboard && echo Starting vendor dashboard... && cd /d %FRONTEND_ADMIN_DIR% && npm run dev"

:: Wait for vendor dashboard to initialize
timeout /t 5 /nobreak > nul

:: Start Cloudflare tunnel
echo Starting Cloudflare tunnel...
start cmd /k "title Cloudflare Tunnel && echo Starting Cloudflare tunnel... && cd /d %PROJECT_ROOT%\cloudflare && cloudflared tunnel --config cloudflared-config.yml run django-multivendor"

:: Display final message
echo.
echo All services started!
echo.
echo URLs:
echo  - Backend API: https://api.bazro.ge/ (local: http://localhost:8000/)
echo  - Customer Frontend: https://shop.bazro.ge/ (local: http://localhost:5173/)
echo  - Vendor Dashboard: https://seller.bazro.ge/ (local: http://localhost:5174/)
echo  - Ollama AI Server: http://localhost:11434/
echo  - Cloudflare Tunnel: https://shop.bazro.ge, https://api.bazro.ge, https://seller.bazro.ge
echo.
echo Press any key to close this window (services will keep running in their own windows).
pause > nul