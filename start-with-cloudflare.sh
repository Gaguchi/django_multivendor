#!/bin/bash

echo "Starting Django Multivendor with Cloudflare Tunnel"

# Check if cloudflared is installed
if ! command -v cloudflared &> /dev/null; then
    echo "Cloudflared is not installed"
    echo "Please install Cloudflared from https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/"
    exit 1
fi

# Start Django and React in background
echo "Starting Django server..."
(cd backend && python manage.py runserver) &
DJANGO_PID=$!

echo "Starting React server..."
(cd frontend && npm run dev) &
REACT_PID=$!

# Wait for services to start
echo "Waiting for services to start..."
sleep 5

# Run cloudflared tunnel
echo "Starting Cloudflare Tunnel..."
cloudflared tunnel --config cloudflared-config.yml run django-multivendor

# Cleanup when the tunnel is closed
kill $DJANGO_PID $REACT_PID 2>/dev/null
