@echo off
echo Starting Django Multivendor Services...

:: Define project paths
set PROJECT_ROOT=E:\Work\WebDev\django_multivendor
set BACKEND_DIR=%PROJECT_ROOT%\backend
set FRONTEND_DIR=%PROJECT_ROOT%\frontend
set FRONTEND_ADMIN_DIR=%PROJECT_ROOT%\frontend-admin
set CLOUDFLARED_CONFIG=%PROJECT_ROOT%\cloudflared-config.yml

:: Check if cloudflared-config.yml exists
if not exist "%CLOUDFLARED_CONFIG%" (
    echo ERROR: cloudflared-config.yml not found at %CLOUDFLARED_CONFIG%
    echo Please create the configuration file before running this script.
    pause
    exit /b 1
)

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

:: Start admin frontend
echo Starting admin frontend...
start cmd /k "title Admin Frontend && echo Starting admin frontend... && cd /d %FRONTEND_ADMIN_DIR% && npm run dev"

:: Wait for admin frontend to initialize
timeout /t 5 /nobreak > nul

:: Start Cloudflare tunnel
echo Starting Cloudflare tunnel...
start cmd /k "title Cloudflare Tunnel && echo Starting Cloudflare tunnel... && cd /d %PROJECT_ROOT% && cloudflared tunnel --config cloudflared-config.yml run django-multivendor"

:: Display final message
echo.
echo All services started!
echo.
echo URLs:
echo  - Backend API: http://localhost:8000/
echo  - Customer Frontend: http://localhost:5173/
echo  - Admin Frontend: http://localhost:5174/
echo  - Cloudflare Tunnel: https://shop.bazro.ge, https://api.bazro.ge, https://seller.bazro.ge
echo.
echo Press any key to close this window (services will keep running in their own windows).
pause > nul