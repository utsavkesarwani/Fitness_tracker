import express from 'express';
import WeeklyPlan from '../models/WeeklyPlan.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

const defaultPlans = [
  { day: 'Monday', focus: 'Chest + Triceps', status: 'Planned' },
  { day: 'Tuesday', focus: 'Back + Biceps', status: 'Completed' },
  { day: 'Wednesday', focus: 'Legs', status: 'Planned' },
  { day: 'Thursday', focus: 'Shoulders', status: 'Completed' },
  { day: 'Friday', focus: 'Upper Body', status: 'Planned' },
  { day: 'Saturday', focus: 'Full Body', status: 'Completed' },
  { day: 'Sunday', focus: 'Recovery / Mobility', status: 'Rest' },
];

router.get('/weekly-plans', async (req, res) => {
  try {
    const plans = await WeeklyPlan.find({ userId: req.user._id }).sort({ createdAt: 1 });

    if (plans.length === 0) {
      const seeded = await WeeklyPlan.insertMany(
        defaultPlans.map((item) => ({ ...item, userId: req.user._id, notes: '' })),
      );
      return res.status(200).json({ plans: seeded });
    }

    return res.status(200).json({ plans });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to fetch weekly plans.' });
  }
});

router.post('/weekly-plans', async (req, res) => {
  try {
    const { day, focus, status, notes } = req.body || {};

    if (!day) {
      return res.status(400).json({ message: 'A day is required to save the workout plan.' });
    }

    const plan = await WeeklyPlan.findOneAndUpdate(
      { userId: req.user._id, day },
      { $set: { userId: req.user._id, focus: focus || 'Recovery / Mobility', status: status || 'Planned', notes: notes || '' } },
      { new: true, upsert: true, runValidators: true },
    );

    return res.status(200).json({ plan });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to save weekly plan.' });
  }
});

export default router;
