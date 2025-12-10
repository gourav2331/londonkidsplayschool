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

# Patch Alpine base to mitigate known CVEs
RUN apk upgrade --no-cache

# Copy custom Nginx configuration (must exist at: nginx/default.conf in this project)
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy built Angular app into Nginx html directory
# If you are using standard Angular build (no SSR):
#   output is usually: dist/playschool-frontend
# If you are using SSR with "browser" folder:
#   output is: dist/playschool-frontend/browser
#
# Pick the correct one for YOUR build:

# --- If SSR/browser build (likely in your current setup) ---
COPY --from=build /app/dist/playschool-frontend/browser /usr/share/nginx/html

# --- If it fails with "no such file or directory", switch to this instead ---
# COPY --from=build /app/dist/playschool-frontend /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
