# backend/Dockerfile

FROM node:20-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy source
COPY . .

# Expose backend port
EXPOSE 8000

# Start server
CMD ["node", "src/server.js"]
