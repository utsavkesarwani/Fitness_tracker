import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/health', async (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const isConnected = dbStatus === 1;

  const response = {
    status: isConnected ? 'ok' : 'degraded',
    message: 'Backend is running and ready for requests.',
    timestamp: new Date().toISOString(),
    database: {
      connected: isConnected,
      state: dbStatus,
      stateName: ['disconnected', 'connected', 'connecting', 'disconnecting'][dbStatus] || 'unknown',
    },
  };

  return res.status(isConnected ? 200 : 503).json(response);
});

export default router;
