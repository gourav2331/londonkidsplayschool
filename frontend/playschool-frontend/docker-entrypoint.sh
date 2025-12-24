#!/bin/sh
set -e

# Clean any existing confs so nginx loads only one file
rm -f /etc/nginx/conf.d/*.conf

if [ "${ENABLE_SSL}" = "true" ]; then
  echo "[entrypoint] ENABLE_SSL=true -> using prod (https) config"
  cp /etc/nginx/conf.d/default.conf.prod /etc/nginx/conf.d/default.conf
else
  echo "[entrypoint] ENABLE_SSL!=true -> using dev (http) config"
  cp /etc/nginx/conf.d/default.dev.conf /etc/nginx/conf.d/default.conf
fi

nginx -t
exec nginx -g "daemon off;"