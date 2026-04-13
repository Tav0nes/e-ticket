# ---------- Stage 1: builder ----------
FROM node:22-alpine AS builder

WORKDIR /app

# Copy only manifests first so this layer is cached
# until package.json or package-lock.json actually changes.
COPY package*.json package-lock.json ./
RUN npm ci

# Now bring in the source and compile TS -> JS into /app/dist
COPY . .
RUN npx ng build --configuration=production

# ---------- Stage 2: runtime ----------
FROM nginx:alpine

# Pull the compiled output from the builder stage
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80