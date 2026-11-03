import express from 'express';
import Workout from '../models/Workout.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

const normalizeDateKey = (value) => new Date(value).toISOString().slice(0, 10);

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getWeekVolume = (workouts) => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + index);
    const key = normalizeDateKey(day);
    const volume = workouts
      .filter((workout) => normalizeDateKey(workout.date) === key)
      .reduce((sum, workout) => sum + (Number(workout.totalVolume) || 0), 0);

    return { name: weekDays[day.getDay()], volume };
  });
};

const getBestLift = (workouts) => {
  const bestByExercise = new Map();

  workouts.forEach((workout) => {
    (workout.exercises || []).forEach((exercise) => {
      const maxWeight = (exercise.sets || []).reduce((max, set) => Math.max(max, Number(set.weight || 0)), 0);

      if (maxWeight <= 0) return;

      const currentBest = bestByExercise.get(exercise.exerciseName);
      if (!currentBest || maxWeight > currentBest.weight) {
        bestByExercise.set(exercise.exerciseName, {
          name: exercise.exerciseName,
          weight: maxWeight,
          date: normalizeDateKey(workout.date),
        });
      }
    });
  });

  return [...bestByExercise.values()].sort((a, b) => b.weight - a.weight)[0] || null;
};

const getInsights = (workouts, analytics) => {
  const insights = [];

  if (analytics.bestLift) {
    insights.push(`${analytics.bestLift.name} reached ${analytics.bestLift.weight} kg as the strongest recorded lift.`);
  }

  if (analytics.totalSessions > 0) {
    insights.push(`You logged ${analytics.totalSessions} training sessions across your recorded history.`);
  }

  if (analytics.weeklyVolume.length > 0) {
    const currentWeekVolume = analytics.weeklyVolume.reduce((sum, item) => sum + item.volume, 0);
    insights.push(`This week’s training load totals ${currentWeekVolume} kg across your workout sessions.`);
  }

  if (analytics.consistency > 0) {
    insights.push(`Your workout consistency is ${analytics.consistency}% for the current week.`);
  }

  return insights;
};

router.get('/analytics', async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user._id }).sort({ date: 1 }).lean();

    const totalSessions = workouts.length;
    const totalSets = workouts.reduce((sum, workout) => sum + (Number(workout.totalSets) || 0), 0);
    const totalVolume = workouts.reduce((sum, workout) => sum + (Number(workout.totalVolume) || 0), 0);
    const averageVolume = totalSessions ? Math.round(totalVolume / totalSessions) : 0;

    const weeklyVolume = getWeekVolume(workouts);
    const sessionsThisWeek = weeklyVolume.filter((day) => day.volume > 0).length;
    const consistency = Math.min(100, Math.round((sessionsThisWeek / 7) * 100));
    const strengthTrend = totalSessions ? Math.min(100, Math.round((totalVolume / Math.max(totalSessions * 2000, 1)) * 100)) : 0;
    const recoveryScore = Math.max(0, 100 - Math.max(0, 7 - sessionsThisWeek) * 10);
    const bestLift = getBestLift(workouts);

    const analytics = {
      totalSessions,
      totalSets,
      totalVolume,
      averageVolume,
      consistency,
      strengthTrend,
      recoveryScore,
      weeklyVolume,
      bestLift,
      insights: [],
    };

    analytics.insights = getInsights(workouts, analytics);

    return res.status(200).json({ analytics });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to load analytics.' });
  }
});

export default router;
