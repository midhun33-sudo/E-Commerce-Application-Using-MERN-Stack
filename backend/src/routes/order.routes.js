import { Router } from 'express';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, async (req, res) => {
  const { items, total, paymentMethod } = req.body;
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'Empty order' });
  const order = await Order.create({ user: req.userId, items, total, paymentMethod: paymentMethod || 'COD' });
  res.status(201).json(order);
});

router.get('/mine', protect, async (req, res) => {
  const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json(orders);
});

export default router;