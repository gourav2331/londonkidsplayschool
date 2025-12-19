# frontend/playschool-frontend/Dockerfile

# =========================
# 1. Build Angular app
# =========================
FROM node:20.18.0-alpine3.20 AS build

RUN apk upgrade --no-cache
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# =========================
# 2. Serve with Nginx
# =========================
FROM nginx:1.27.2-alpine3.20

RUN apk upgrade --no-cache

# Copy BOTH nginx configs (prod https + dev http)
COPY nginx/default.conf /etc/nginx/conf.d/default.conf.prod
COPY nginx/default.dev.conf /etc/nginx/conf.d/default.dev.conf

# Entry script chooses correct config at runtime
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Clean default content
RUN rm -rf /usr/share/nginx/html/*

# Angular build output (you are copying browser/)
COPY --from=build /app/dist/playschool-frontend/browser/ /usr/share/nginx/html/

# ✅ FIX: Angular produced index.csr.html; nginx needs index.html
RUN if [ ! -f /usr/share/nginx/html/index.html ] && [ -f /usr/share/nginx/html/index.csr.html ]; then \
      mv /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html; \
    fi

EXPOSE 80 443
ENTRYPOINT ["/docker-entrypoint.sh"]