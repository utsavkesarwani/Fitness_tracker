import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import dashboardRoutes from './routes/dashboard.js';
import healthRoutes from './routes/health.js';

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
app.use('/api', dashboardRoutes);

export default app;
