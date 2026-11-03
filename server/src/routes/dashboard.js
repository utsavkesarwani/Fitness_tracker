import express from 'express';

const router = express.Router();

const dashboardOverview = {
  overview: {
    totalSessions: 42,
    currentStreak: 6,
    weeklyCompletion: 83,
    totalSets: 218,
    currentWeight: 78.4,
  },
  weeklyActivity: [
    { day: 'Mon', sessions: 2 },
    { day: 'Tue', sessions: 1 },
    { day: 'Wed', sessions: 3 },
    { day: 'Thu', sessions: 2 },
    { day: 'Fri', sessions: 1 },
    { day: 'Sat', sessions: 3 },
    { day: 'Sun', sessions: 1 },
  ],
  summary: [
    { label: 'Workout completion', value: '83%', progress: 83 },
    { label: 'Strength trend', value: '+12%', progress: 71 },
    { label: 'Active recovery', value: '4/7', progress: 57 },
    { label: 'Goal hit rate', value: '76%', progress: 76 },
  ],
  recentWorkouts: [
    { id: 1, name: 'Bench Press', date: '2026-11-03', muscleGroup: 'Chest', volume: 1025, sets: 4 },
    { id: 2, name: 'Deadlift', date: '2026-11-01', muscleGroup: 'Back', volume: 1245, sets: 3 },
    { id: 3, name: 'Back Squat', date: '2026-10-30', muscleGroup: 'Legs', volume: 1180, sets: 4 },
    { id: 4, name: 'Shoulder Press', date: '2026-10-28', muscleGroup: 'Shoulders', volume: 664, sets: 3 },
    { id: 5, name: 'Pull-Ups', date: '2026-10-26', muscleGroup: 'Back', volume: 530, sets: 5 },
  ],
  volumeTrend: [
    { name: 'Mon', volume: 620 },
    { name: 'Tue', volume: 700 },
    { name: 'Wed', volume: 880 },
    { name: 'Thu', volume: 760 },
    { name: 'Fri', volume: 820 },
    { name: 'Sat', volume: 910 },
    { name: 'Sun', volume: 680 },
  ],
};

router.get('/dashboard/overview', (req, res) => {
  return res.status(200).json(dashboardOverview);
});

export default router;
