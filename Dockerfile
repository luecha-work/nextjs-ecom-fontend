# Build stage
FROM node:18.17.1-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock* ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN yarn build

# Production stage
FROM node:18.17.1-alpine AS runner

WORKDIR /app

# Set to production environment
ENV NODE_ENV=production

# Copy necessary files from build stage
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the listening port
EXPOSE 3000

# Run the application
CMD ["yarn", "start"]