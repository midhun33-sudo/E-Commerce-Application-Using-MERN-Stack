# MERN E‑Commerce Starter (Full Feature)

This is a minimal but full‑featured MERN e‑commerce starter: auth (JWT), products, cart, orders (COD).

## Quickstart
### API
cd server
cp .env.example .env  # set MONGO_URI, JWT_SECRET, CORS_ORIGIN
npm i
npm run seed  # optional demo data
npm run dev

### Web
cd web
npm i
# create .env and set VITE_API_URL=http://localhost:8080 (or your deployed API)
npm run dev

## Deploy
- API on Render (root=/server). Environment: MONGO_URI, JWT_SECRET, CORS_ORIGIN
- Web on Vercel (root=/web). Env: VITE_API_URL
