# Deploy frontend — Coolify (Docker)

## Health check

| Path | Use |
|------|-----|
| `GET /api/health` | Docker `HEALTHCHECK`, Coolify health path |

Response `200`: `{ "status": "ok", "service": "linkpulse-frontend" }`

## Coolify setup

1. New resource → **GitHub** → repo `ivanzaki-dev/frontend-linkpulse`, branch `main`
2. Build pack: **Dockerfile** (root `Dockerfile`)
3. Port: **3000**
4. Health check path: `/api/health`
5. Environment variables:

| `NEXT_PUBLIC_SHOW_DEV_LINKS` | `false` on public production (hides footer dev/admin links) |

| Variable | Build / Runtime | Example |
|----------|-----------------|--------|
| `NEXT_PUBLIC_API_URL` | **Build** (Docker build arg) | `https://<backend-host>/v1` |
| `API_URL` | Runtime | Same as above (server routes `/api/pay`) |
| `PAYMENT_WEBHOOK_SECRET` | Runtime | Same value as backend `PAYMENT_WEBHOOK_SECRET` |

> `NEXT_PUBLIC_*` is baked at image build time. Set it in Coolify **Build** variables or Dockerfile `ARG`.

6. On backend Coolify service, add frontend URL to `CORS_ORIGIN` (comma-separated).

## Local Docker test

```powershell
cd frontend
docker build -t linkpulse-frontend --build-arg NEXT_PUBLIC_API_URL=https://mo5ub2s6knxuqchfa3m925ep.app.ivanzaki.online/v1 .
docker run --rm -p 3000:3000 `
  -e PAYMENT_WEBHOOK_SECRET=your-secret `
  -e API_URL=https://mo5ub2s6knxuqchfa3m925ep.app.ivanzaki.online/v1 `
  linkpulse-frontend
curl http://127.0.0.1:3000/api/health
```
