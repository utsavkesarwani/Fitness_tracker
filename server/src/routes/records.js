import express from 'express';
import Workout from '../models/Workout.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

const normalizeDateKey = (value) => new Date(value).toISOString().slice(0, 10);

router.get('/personal-records', async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user._id }).sort({ date: 1 }).lean();
    const recordsByExercise = new Map();

    workouts.forEach((workout) => {
      (workout.exercises || []).forEach((exercise) => {
        const maxWeight = (exercise.sets || []).reduce((highest, set) => Math.max(highest, Number(set.weight || 0)), 0);

        if (maxWeight <= 0) {
          return;
        }

        const existing = recordsByExercise.get(exercise.exerciseName);
        if (!existing || maxWeight > existing.weight) {
          recordsByExercise.set(exercise.exerciseName, {
            exercise: exercise.exerciseName,
            weight: maxWeight,
            date: normalizeDateKey(workout.date),
          });
        }
      });
    });

    const records = [...recordsByExercise.values()].sort((first, second) => second.weight - first.weight);
    return res.status(200).json({ records });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to load personal records.' });
  }
});

export default router;
