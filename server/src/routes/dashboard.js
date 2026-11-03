import express from 'express';
import Workout from '../models/Workout.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

const formatDayLabel = (date) => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return dayNames[new Date(date).getDay()];
};

const getMaxWeight = (workouts) => {
  const allWeights = workouts.flatMap((workout) =>
    (workout.exercises || []).flatMap((exercise) =>
      (exercise.sets || []).map((set) => Number(set.weight || 0)),
    ),
  );

  return allWeights.length ? Math.max(...allWeights) : 0;
};

const buildOverview = async (userId) => {
  const workouts = await Workout.find({ userId }).sort({ date: -1 }).lean();

  const totalSessions = workouts.length;
  const totalSets = workouts.reduce((sum, workout) => sum + (Number(workout.totalSets) || 0), 0);
  const totalVolume = workouts.reduce((sum, workout) => sum + (Number(workout.totalVolume) || 0), 0);

  const dayKeys = new Set(workouts.map((workout) => new Date(workout.date).toISOString().slice(0, 10)));
  let currentStreak = 0;
  const cursor = new Date();

  while (dayKeys.has(cursor.toISOString().slice(0, 10))) {
    currentStreak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const startOfWeek = new Date();
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const weeklyActivity = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + index);
    const key = day.toISOString().slice(0, 10);
    const sessions = workouts.filter((workout) => new Date(workout.date).toISOString().slice(0, 10) === key).length;

    return { day: formatDayLabel(day), sessions };
  });

  const currentWeight = getMaxWeight(workouts);

  const recentWorkouts = workouts
    .flatMap((workout) =>
      (workout.exercises || []).map((exercise) => ({
        id: `${workout._id}-${exercise.exerciseName}`,
        name: exercise.exerciseName,
        date: new Date(workout.date).toISOString().slice(0, 10),
        muscleGroup: exercise.muscleGroup,
        volume: (exercise.sets || []).reduce(
          (sum, set) => sum + Number(set.weight || 0) * Number(set.reps || 0),
          0,
        ),
        sets: (exercise.sets || []).length,
      })),
    )
    .slice(0, 5);

  const volumeTrend = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + index);
    const key = day.toISOString().slice(0, 10);
    const volume = workouts
      .filter((workout) => new Date(workout.date).toISOString().slice(0, 10) === key)
      .reduce((sum, workout) => sum + (Number(workout.totalVolume) || 0), 0);

    return { name: formatDayLabel(day), volume };
  });

  const sessionsThisWeek = weeklyActivity.filter((day) => day.sessions > 0).length;
  const weeklyCompletion = Math.min(100, Math.round((sessionsThisWeek / 7) * 100));
  const strengthProgress = totalVolume ? Math.min(99, Math.round((totalVolume / Math.max(totalSessions * 1500, 1)) * 100)) : 0;
  const activeRecovery = Math.max(0, Math.min(100, Math.round(((7 - sessionsThisWeek) / 7) * 100)));
  const goalHitRate = Math.min(100, Math.max(0, Math.round((totalVolume / Math.max(totalSessions * 2000, 1)) * 100)));

  const summary = [
    { label: 'Workout completion', value: `${weeklyCompletion}%`, progress: weeklyCompletion },
    { label: 'Strength trend', value: `${strengthProgress >= 0 ? '+' : ''}${strengthProgress}%`, progress: strengthProgress },
    { label: 'Active recovery', value: `${Math.min(7, Math.max(0, 7 - sessionsThisWeek))}/7`, progress: activeRecovery },
    { label: 'Goal hit rate', value: `${goalHitRate}%`, progress: goalHitRate },
  ];

  return {
    overview: {
      totalSessions,
      currentStreak,
      weeklyCompletion,
      totalSets,
      currentWeight,
    },
    weeklyActivity,
    summary,
    recentWorkouts,
    volumeTrend,
  };
};

router.get('/dashboard/overview', async (req, res) => {
  try {
    const overview = await buildOverview(req.user._id);
    return res.status(200).json(overview);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to load dashboard overview.' });
  }
});

export default router;
