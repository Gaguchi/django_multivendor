REM Run cloudflared tunnel
echo Starting Cloudflare Tunnel...
cloudflared tunnel --config cloudflared-config.yml run django-multivendor

REM Keep the window open if there's an error
if %errorlevel% neq 0 (
    echo Cloudflared tunnel failed to start
    pause
)