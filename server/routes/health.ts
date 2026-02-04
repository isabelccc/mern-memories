import express from 'express';
import prisma from '../prisma/client.js';

const router = express.Router();

/**
 * Health check endpoint
 * Returns the health status of the application and database
 */
router.get('/', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    const dbStatus = 'connected';

    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: dbStatus,
      version: process.env.npm_package_version || '1.0.0',
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: 'disconnected',
      error: process.env.NODE_ENV === 'production' 
        ? 'Service unavailable' 
        : (error as Error).message,
    });
  }
});

/**
 * Readiness probe (for Kubernetes/Docker)
 * Checks if the application is ready to receive traffic
 */
router.get('/ready', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ ready: true });
  } catch (error) {
    res.status(503).json({ ready: false });
  }
});

/**
 * Liveness probe (for Kubernetes/Docker)
 * Checks if the application is alive
 */
router.get('/live', (req, res) => {
  res.status(200).json({ alive: true });
});

export default router;
