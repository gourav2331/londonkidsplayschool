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

# Copy both nginx configs
COPY nginx/default.conf /etc/nginx/conf.d/default.conf.prod
COPY nginx/default.dev.conf /etc/nginx/conf.d/default.dev.conf

# Copy entrypoint that chooses the right config
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Remove default nginx html
RUN rm -rf /usr/share/nginx/html/*

# Copy Angular build output (SSR browser/)
COPY --from=build /app/dist/playschool-frontend/browser/ /usr/share/nginx/html/

EXPOSE 80 443
ENTRYPOINT ["/docker-entrypoint.sh"]