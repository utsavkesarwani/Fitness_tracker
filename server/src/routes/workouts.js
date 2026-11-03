import express from 'express';
import Workout from '../models/Workout.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

const sanitizeWorkout = (input) => {
  if (!input || !Array.isArray(input.exercises) || input.exercises.length === 0) {
    const error = new Error('A workout must include at least one exercise.');
    error.statusCode = 400;
    throw error;
  }

  const sanitizedExercises = input.exercises.map((exercise) => {
    const normalizedSets = Array.isArray(exercise.sets) ? exercise.sets : [];

    if (!exercise.exerciseName || !exercise.muscleGroup || normalizedSets.length === 0) {
      const error = new Error('Each exercise must include a name, muscle group, and at least one set.');
      error.statusCode = 400;
      throw error;
    }

    return {
      exerciseName: String(exercise.exerciseName).trim(),
      muscleGroup: String(exercise.muscleGroup).trim(),
      sets: normalizedSets.map((set, index) => ({
        setNumber: Number(set.setNumber ?? index + 1),
        reps: Number(set.reps ?? 0),
        weight: Number(set.weight ?? 0),
        restTime: Number(set.restTime ?? 0),
      })),
    };
  });

  const totalSets = sanitizedExercises.reduce((sum, exercise) => sum + exercise.sets.length, 0);
  const totalVolume = sanitizedExercises.reduce(
    (sum, exercise) => sum + exercise.sets.reduce((exerciseSum, set) => exerciseSum + (Number(set.weight) * Number(set.reps)), 0),
    0,
  );

  return {
    date: input.date || new Date().toISOString(),
    notes: String(input.notes || '').trim(),
    durationMinutes: Number(input.durationMinutes ?? 45),
    restTimeSeconds: Number(input.restTimeSeconds ?? 90),
    completed: Boolean(input.completed),
    exercises: sanitizedExercises,
    totalSets,
    totalVolume,
  };
};

router.get('/workouts', async (req, res) => {
  try {
    const { date } = req.query;
    const query = { userId: req.user._id };

    if (date) {
      const targetDate = new Date(date);
      if (Number.isNaN(targetDate.getTime())) {
        return res.status(400).json({ message: 'Invalid workout date provided.' });
      }

      const start = new Date(targetDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(targetDate);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lt: end };
    }

    const workouts = await Workout.find(query).sort({ date: -1 });
    return res.status(200).json({ workouts });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to fetch workouts.' });
  }
});

router.post('/workouts', async (req, res) => {
  try {
    const payload = sanitizeWorkout(req.body);
    const workout = new Workout({ ...payload, userId: req.user._id });
    await workout.save();

    return res.status(201).json({ workout });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ message: error.message || 'Unable to save workout.' });
  }
});

export default router;
