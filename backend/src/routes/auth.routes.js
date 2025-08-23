// server/src/routes/auth.routes.js
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { protect } from '../middleware/auth.js';


const router = Router();

// GET /api/auth/me  -> returns current user from token
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.userId).lean();
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email in use' });

    const passwordHash = await bcrypt.hash(password, 10);

    // If you want the first user to be admin automatically, you can check count here.
    // For now we default to false.
    const user = await User.create({ name, email, passwordHash, isAdmin: false });

    return res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,          // ← include isAdmin
      },
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    return res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,          // ← include isAdmin
      },
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;


