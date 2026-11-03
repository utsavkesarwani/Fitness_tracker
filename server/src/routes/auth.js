import express from 'express';
import User from '../models/User.js';
import { protect, signToken } from '../middleware/auth.js';

const router = express.Router();

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

const getDemoUser = async () => {
  const demoUser = await User.findOne({ email: 'demo@fitness.local' });

  if (demoUser) {
    return demoUser;
  }

  return User.create({
    name: 'Demo User',
    email: 'demo@fitness.local',
    password: 'demo123456',
  });
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email: String(email).trim().toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const user = await User.create({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      password: String(password),
    });

    const token = signToken(user);
    return res.status(201).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to register user.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: String(email).trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isValidPassword = await user.comparePassword(String(password));
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signToken(user);
    return res.status(200).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to log in.' });
  }
});

router.post('/demo-login', async (req, res) => {
  try {
    const user = await getDemoUser();
    const token = signToken(user);
    return res.status(200).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to create demo session.' });
  }
});

router.get('/me', protect, async (req, res) => {
  return res.status(200).json({ user: sanitizeUser(req.user) });
});

export default router;
