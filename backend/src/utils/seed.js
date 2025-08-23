import 'dotenv/config';
import { connectDB } from '../config/db.js';
import Product from '../models/Product.js';

const demo = [
  { name: 'Classic Tee', description: '100% cotton', price: 499, countInStock: 25, category: 'apparel' },
  { name: 'Wireless Mouse', description: 'Ergonomic, 2.4GHz', price: 899, countInStock: 40, category: 'electronics' },
  { name: 'Notebook', description: '200 pages, ruled', price: 99, countInStock: 100, category: 'stationery' }
];

(async () => {
  await connectDB();
  await Product.deleteMany({});
  await Product.insertMany(demo);
  console.log('Seeded products');
  process.exit(0);
})();