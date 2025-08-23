// server/src/routes/product.routes.js
import { Router } from 'express';
import Product from '../models/Product.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Public: list + details
router.get('/', async (_req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ message: 'Not found' });
  res.json(p);
});

// Admin: create
router.post('/', protect, requireAdmin, async (req, res) => {
  try {
    const { name, description = '', image, price, countInStock = 0, brand = '', category = 'general' } = req.body;
    if (!name || price == null) return res.status(400).json({ message: 'name & price required' });

    const product = await Product.create({
      name,
      description,
      image: image || 'https://placehold.co/600x400',
      price,
      countInStock,
      brand,
      category
    });

    res.status(201).json(product);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Admin: update
router.put('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Admin: delete
router.delete('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
