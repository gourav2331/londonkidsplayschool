#!/bin/sh
# Docker entrypoint script for nginx
# Checks if SSL certificates exist and uses appropriate config

set -e

SSL_CERT="/etc/letsencrypt/live/playschoolgopalpur.in/fullchain.pem"
SSL_KEY="/etc/letsencrypt/live/playschoolgopalpur.in/privkey.pem"

# Check if SSL certificates exist
if [ -f "$SSL_CERT" ] && [ -f "$SSL_KEY" ]; then
    echo "✓ SSL certificates found - using PRODUCTION configuration with HTTPS"
    # Use production config (default.conf with SSL)
    cp /etc/nginx/conf.d/default.conf.prod /etc/nginx/conf.d/default.conf
else
    echo "⚠ SSL certificates NOT found - using DEVELOPMENT configuration (HTTP only)"
    echo "  For production, ensure SSL certificates are mounted at /etc/letsencrypt"
    # Use development config (no SSL)
    cp /etc/nginx/conf.d/default.dev.conf /etc/nginx/conf.d/default.conf
fi

# Start nginx
exec nginx -g "daemon off;"

