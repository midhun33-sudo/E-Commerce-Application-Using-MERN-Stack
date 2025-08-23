import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { connectDB } from './src/config/db.js';
import authRoutes from './src/routes/auth.routes.js';
import productRoutes from './src/routes/product.routes.js';
import orderRoutes from './src/routes/order.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import uploadRoutes from './src/routes/upload.routes.js';


const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));
app.use(express.json());
app.use(morgan('tiny'));

app.get('/', (_, res) => res.json({ ok: true, service: 'ecom-api' }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

const port = process.env.PORT || 8080;
connectDB().then(() => {
  app.listen(port, () => console.log(`API running on https://localhost:${port}`));
});

app.get('/api', (_, res) => res.json({ ok: true, service: 'ecom-api' }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Upload endpoint
app.use('/api/upload', uploadRoutes);