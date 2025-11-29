### Stage 1: Build Vite React app
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

### Stage 2: Serve built files with a lightweight Node static server
FROM node:20-alpine AS runner

WORKDIR /app

# install a tiny static server globally
RUN npm install -g serve@14

# copy built files from builder
COPY --from=builder /app/dist ./dist

EXPOSE 80

CMD ["serve", "-s", "dist", "-l", "80"]
