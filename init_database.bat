@echo off
echo ===== Django Multivendor Project Setup =====

echo [1/3] Installing required packages...
pip install -r requirements.txt
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install required packages.
    echo Please run 'pip install -r requirements.txt' manually.
    pause
    exit /b 1
)

echo [2/3] Running database migrations for django_multivendor...
cd backend

echo - Preparing token blacklist migrations...
python manage.py makemigrations token_blacklist
IF %ERRORLEVEL% NEQ 0 (
    echo Note: Token blacklist migrations might not be needed or already exist.
)

echo - Applying token blacklist migrations...
python manage.py migrate token_blacklist --noinput
IF %ERRORLEVEL% NEQ 0 (
    echo Note: Token blacklist migrations might not be needed or already exist.
)

echo - Applying all remaining migrations...
python manage.py migrate --noinput
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Database migration failed.
    pause
    exit /b 1
)

echo [3/3] Database setup complete!
echo.
echo You can now start the server with:
echo cd backend
echo python run_ssl.py
pause
