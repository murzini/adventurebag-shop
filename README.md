# AdventureBag - Shop app

This repo contains the standalone **Shop** application:
- Renders Landing, Search, Details, Checkout, and Thank You prototype flows.
- Consumes Shop CMS configuration from Coach via `COACH_BASE_URL`.
- Supports Student tour mode via query parameters (`tour`, `step`, `sku`).

## Run locally
```bash
npm install
npm run dev
```

## Environment
- `COACH_BASE_URL` must point to the Coach base domain (without trailing slash).

## Deploy to Vercel
- Framework: Next.js
- Node: 20.x
- Root Directory: repo root