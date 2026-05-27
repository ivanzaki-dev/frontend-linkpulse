# LinkPulse frontend — Next.js standalone for Coolify / Docker
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache curl

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_API_URL=https://mo5ub2s6knxuqchfa3m925ep.app.ivanzaki.online/v1
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
# Required for next build (avoids prerender / Html errors if host injects NODE_ENV=development)
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Coolify/VPS builds can OOM during compile without a higher heap
ENV NODE_OPTIONS=--max-old-space-size=2048
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=90s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
