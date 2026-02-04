# Multi-stage build for React application
# Stage 1: Build the React app
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
# Using npm ci with --legacy-peer-deps to handle peer dependency conflicts
# This is needed because eslint-config-airbnb has peer dependency conflicts
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build arguments for environment variables
ARG REACT_APP_API_URL
ARG REACT_APP_GOOGLE_CLIENT_ID
ARG REACT_APP_SENTRY_DSN

# Set environment variables for build
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_GOOGLE_CLIENT_ID=$REACT_APP_GOOGLE_CLIENT_ID
ENV REACT_APP_SENTRY_DSN=$REACT_APP_SENTRY_DSN
ENV NODE_ENV=production

# Build the React app
# This creates the optimized production build in /app/build
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built React app from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy _redirects file if needed (for SPA routing)
# Note: nginx.conf handles this, but keeping for reference
COPY --from=builder /app/public/_redirects /usr/share/nginx/html/_redirects

# Create nginx cache directory
RUN mkdir -p /var/cache/nginx/client_temp && \
    mkdir -p /var/cache/nginx/proxy_temp && \
    chown -R nginx:nginx /var/cache/nginx

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
