# ============================
# Stage 1: Build React app
# ============================
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first for layer caching
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm install

# Define build arguments
ARG REACT_APP_API_URL
ARG REACT_APP_RAZORPAY_KEY

# Set them as environment variables so React scripts can see them
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_RAZORPAY_KEY=$REACT_APP_RAZORPAY_KEY

# Copy source code
COPY . .

# Build production bundle
RUN npm run build

# ============================
# Stage 2: Serve with nginx
# ============================
FROM nginx:alpine

# Copy built files from build stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx config for React Router support
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
