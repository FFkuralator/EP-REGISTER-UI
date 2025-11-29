### Stage 1: Build Vite React app
FROM node:20-alpine AS builder

WORKDIR /app

# install exact deps (dev deps needed for build)
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# copy source and build
COPY . .
RUN npm run build

### Stage 2: runtime - install only production deps and serve built files
FROM node:20-alpine AS runner

WORKDIR /app

# copy lockfile so we can install only production deps reproducibly
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

# copy built files from builder
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 80

CMD ["npm", "start"]
