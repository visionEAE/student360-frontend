# syntax=docker/dockerfile:1.7
# The SPA as a Cloud Run service: Vite build → nginx serving the static bundle.
# VITE_GATEWAY_URL is inlined at BUILD time (import.meta.env), which is why the deploy pipeline
# fetches the gateway's live URL and passes it here — and folds it into the image's content
# hash, so a recreated gateway makes the web image stale even when no source moved.

FROM node:22-alpine AS build

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

ARG VITE_GATEWAY_URL
ENV VITE_GATEWAY_URL=${VITE_GATEWAY_URL}

COPY tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts index.html ./
COPY public/ public/
COPY src/ src/
RUN npm run build

# ---------------------------------------------------------------------------------------------
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /build/dist/ /usr/share/nginx/html/

# Cloud Run sends traffic to $PORT; 8080 matches what terraform-core configures.
EXPOSE 8080
