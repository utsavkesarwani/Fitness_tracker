import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import analyticsRoutes from './routes/analytics.js';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import healthRoutes from './routes/health.js';
import measurementRoutes from './routes/measurements.js';
import personalRecordRoutes from './routes/records.js';
import weeklyPlanRoutes from './routes/planner.js';
import workoutRoutes from './routes/workouts.js';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    name: 'Gym Fitness Tracker API',
    status: 'running',
  });
});

app.use('/api', healthRoutes);
app.use('/api', authRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', workoutRoutes);
app.use('/api', measurementRoutes);
app.use('/api', weeklyPlanRoutes);
app.use('/api', analyticsRoutes);
app.use('/api', personalRecordRoutes);

export default app;
