### Stage 1: Build Vite React app
FROM node:20-alpine AS builder

WORKDIR /app

# install exact deps (dev deps needed for build)
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund \
	&& npm cache clean --force

# copy source and build
COPY . .
ARG VITE_MODE=dev
RUN npm run build -- --mode $VITE_MODE

### Stage 2: runtime - serve static files with lightweight nginx
FROM nginx:1.27-alpine AS runner

WORKDIR /usr/share/nginx/html

# конфиг для сервера нгинх
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist .


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]