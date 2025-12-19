#!/bin/sh
set -eu

# Default is dev (HTTP only)
ENABLE_SSL="${ENABLE_SSL:-false}"

rm -f /etc/nginx/conf.d/default.conf

if [ "$ENABLE_SSL" = "true" ]; then
  # Prod HTTPS config
  cp /etc/nginx/conf.d/default.conf.prod /etc/nginx/conf.d/default.conf
else
  # Dev HTTP config
  cp /etc/nginx/conf.d/default.dev.conf /etc/nginx/conf.d/default.conf
fi

# Safety: if index.html missing but index.csr.html exists, fix it
if [ ! -f /usr/share/nginx/html/index.html ] && [ -f /usr/share/nginx/html/index.csr.html ]; then
  mv /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html
fi

nginx -g "daemon off;"