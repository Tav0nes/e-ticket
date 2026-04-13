# ---------- Stage 1: builder ----------
FROM node:22-alpine AS builder

WORKDIR /app

# Copy only manifests first so this layer is cached
# until package.json or package-lock.json actually changes.
COPY package*.json ./
RUN npm ci

# Now bring in the source and compile TS -> JS into /app/dist
COPY . .
RUN npm run build

# ---------- Stage 2: runtime ----------
FROM node:22-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

# Re-install only production deps (no Jest, ESLint, ts-node, etc.)
COPY package*.json ./
RUN npm ci --omit=dev

# Pull the compiled output from the builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]