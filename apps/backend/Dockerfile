
# Base image
FROM ovrclk/bun:1.0.25-alpine as base

WORKDIR /app

# Builder stage
FROM base as builder

COPY package.json bun.lock ./
COPY --from=node:20.10-alpine /usr/local/bin/node /usr/local/bin/node

# Install dependencies (including dev deps for building)
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build backend
RUN bunx nx build backend --configuration=production

# Runner stage
FROM base as runner
ENV NODE_ENV=production

# Copy built artifacts and dependencies
COPY --from=builder /app/dist/apps/backend ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy migrations if needed
COPY --from=builder /app/apps/backend/prisma ./prisma
COPY --from=builder /app/apps/backend/src/modules/images/migrations ./migrations

# Expose port (default 3000)
EXPOSE 3000

# Start command
CMD ["bun", "run", "dist/main.js"]
