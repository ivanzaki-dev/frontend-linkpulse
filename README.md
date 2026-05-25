# LinkPulse Frontend

Next.js 15 app (customer + admin) for LinkPulse. Connects to `linkpulse-backend` API.

- Dev: `npm run dev` → http://localhost:3001
- Production Docker: port **3000**, health `GET /api/health`

See [DEPLOY.md](./DEPLOY.md) for Coolify on VPS.

## Env

Copy `.env.example` → `.env.local` for local dev.

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Public API base (`/v1`) |
| `API_URL` | Server-side API (pay webhook proxy) |
| `PAYMENT_WEBHOOK_SECRET` | Secret for `POST /api/pay` → backend webhook |
