import express from 'express';
import BodyMeasurement from '../models/BodyMeasurement.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

const normalizeMeasurement = (input = {}) => {
  const safeNumber = (value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  };

  const weight = safeNumber(input.weight);
  const height = safeNumber(input.height);
  const bmi = weight > 0 && height > 0 ? Number((weight / ((height / 100) ** 2)).toFixed(1)) : 0;

  return {
    date: input.date ? new Date(input.date) : new Date(),
    weight,
    height,
    chest: safeNumber(input.chest),
    waist: safeNumber(input.waist),
    hips: safeNumber(input.hips),
    biceps: safeNumber(input.biceps),
    thigh: safeNumber(input.thigh),
    bodyFatPercent: safeNumber(input.bodyFatPercent),
    restingHeartRate: safeNumber(input.restingHeartRate),
    bmi,
  };
};

router.get('/measurements', async (req, res) => {
  try {
    const measurements = await BodyMeasurement.find({ userId: req.user._id }).sort({ date: -1 });
    return res.status(200).json({ measurements });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to fetch measurements.' });
  }
});

router.post('/measurements', async (req, res) => {
  try {
    const payload = normalizeMeasurement(req.body);
    const measurement = new BodyMeasurement({ ...payload, userId: req.user._id });
    await measurement.save();

    return res.status(201).json({ measurement });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to save measurement.' });
  }
});

export default router;
