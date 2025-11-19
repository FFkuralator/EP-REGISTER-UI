### Stage 1: Build Vite React app
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

### Stage 2: Serve with nginx
FROM nginx:stable-alpine AS runner

WORKDIR /etc/nginx

COPY nginx/mime.types mime.types
COPY nginx/prod.conf nginx.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
