# Deploy frontend — Coolify (Docker)

## Health check

| Path | Use |
|------|-----|
| `GET /api/health` | Docker `HEALTHCHECK`, Coolify health path |

Response `200`: `{ "status": "ok", "service": "linkpulse-frontend" }`

## Coolify setup

1. New resource → **GitHub** → repo `ivanzaki-dev/frontend-linkpulse`, branch `main`
2. Build pack: **Dockerfile** (root `Dockerfile` — jangan pakai Nixpacks auto-generated)
3. Port: **3000**
4. Build timeout: minimal **10 menit** (Next.js compile + static gen ~1–3 menit di VPS kecil)
5. Health check path: `/api/health`
6. Environment variables:

| `NEXT_PUBLIC_SHOW_DEV_LINKS` | `false` on public production (hides footer dev/admin links) |

| Variable | Build / Runtime | Example |
|----------|-----------------|--------|
| `NEXT_PUBLIC_API_URL` | **Build** (Docker build arg) | `https://mo5ub2s6knxuqchfa3m925ep.app.ivanzaki.online/v1` (**backend**, bukan URL frontend) |
| `API_URL` | Runtime | Same as `NEXT_PUBLIC_API_URL` (server route `/api/pay`) |

**Salah umum:** `NEXT_PUBLIC_API_URL=https://ji3qif2…/v1` (host frontend) → login/API 404 atau error Bearer.  
**Benar:** API = `mo5ub2…`, UI admin = `ji3qif2…/admin/login` (tanpa `/v1`).
| `PAYMENT_WEBHOOK_SECRET` | Runtime | Same value as backend `PAYMENT_WEBHOOK_SECRET` |

> `NEXT_PUBLIC_*` is baked at image build time. Set it in Coolify **Build** variables or Dockerfile `ARG`.

7. On backend Coolify service, add frontend URL to `CORS_ORIGIN` (comma-separated).

**Build gagal di “Creating an optimized production build” (~20 detik):** biasanya timeout Coolify atau RAM. Pastikan build timeout ≥10 menit; Dockerfile memaksa `NODE_ENV=production` di stage builder.

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
