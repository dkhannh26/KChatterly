# Build stage
FROM node:20-alpine AS builder

# accept an API URL from build args so Vite can bake it into the bundle
ARG VITE_API_URL
# passing it through to the env make it available to `import.meta.env`
ENV VITE_API_URL=${VITE_API_URL}

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# build will use VITE_API_URL if provided, otherwise fall back to code default
RUN npm run build

# Production stage using nginx to serve static files and proxy API
FROM nginx:alpine AS production

# copy custom configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copy built frontend assets
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
