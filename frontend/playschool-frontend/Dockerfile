# =========================
# 1. Build Angular app
# =========================
FROM node:20.18.0-alpine3.20 AS build

# Patch Alpine base to mitigate known CVEs
RUN apk upgrade --no-cache

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source
COPY . .

# Build the Angular app (production)
# If your build script is different, adjust this (e.g. "build:ssr")
RUN npm run build

# =========================
# 2. Serve with Nginx
# =========================
FROM nginx:1.27.2-alpine3.20

RUN apk upgrade --no-cache

# Copy custom Nginx config
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# IMPORTANT: remove default nginx welcome files
RUN rm -rf /usr/share/nginx/html/*

# Copy Angular build output
# Try SSR output first (Angular 17+ SSR produces browser/)
COPY --from=build /app/dist/playschool-frontend/browser/ /usr/share/nginx/html/

# If your build is NOT SSR and fails, switch to:
# COPY --from=build /app/dist/playschool-frontend/ /usr/share/nginx/html/

# If Angular produced index.csr.html but not index.html, create index.html for nginx
RUN if [ -f /usr/share/nginx/html/index.csr.html ] && [ ! -f /usr/share/nginx/html/index.html ]; then \
      cp /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html ; \
    fi


EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

