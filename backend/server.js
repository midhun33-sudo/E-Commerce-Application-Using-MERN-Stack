// server.js
import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './src/config/db.js';
import authRoutes from './src/routes/auth.routes.js';
import productRoutes from './src/routes/product.routes.js';
import orderRoutes from './src/routes/order.routes.js';
import uploadRoutes from './src/routes/upload.routes.js';

const app = express();

/* ---------- CORS (safe + production-friendly) ---------- */
const parsedOrigins = (process.env.CORS_ORIGIN ?? '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

// If you plan to use credentials (cookies/JWT in browser), do NOT use "*".
// Fall back to some common safe origins (localhost + vercel) if env is empty.
const corsOptions = {
  origin: parsedOrigins.length
    ? parsedOrigins
    : [
        /localhost:\d+$/,                 // any localhost port in dev
        /\.vercel\.app$/,                // your Vercel frontend
      ],
  credentials: true,
};
app.use(cors(corsOptions));

/* ---------- Common middleware ---------- */
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'tiny' : 'dev'));

// Helpful if you later use secure cookies behind a proxy (Render/NGINX/etc.)
app.set('trust proxy', 1);

/* ---------- Health + root checks ---------- */
app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'ecom-api',
    time: new Date().toISOString(),
    uptime: process.uptime(),
    env: process.env.NODE_ENV || 'development',
  });
});

// keep your existing quick checks
app.get('/', (_req, res) => res.json({ ok: true, service: 'ecom-api' }));
app.get('/api', (_req, res) => res.json({ ok: true, service: 'ecom-api' }));

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'ecom-api',
    time: new Date().toISOString(),
  });
});

/* ---------- API routes ---------- */
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

/* ---------- Static uploads (note: ephemeral on Render) ---------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // consider S3/Cloudinary later

// Upload endpoint
app.use('/api/upload', uploadRoutes);

/* ---------- Start server only after DB connects ---------- */
const PORT = process.env.PORT || 8080;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB:', err?.message || err);
    process.exit(1);
  });

/* ---------- Graceful shutdown (optional) ---------- */
process.on('SIGINT', () => {
  console.log('Shutting down...');
  process.exit(0);
});
