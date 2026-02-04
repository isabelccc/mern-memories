import helmet from 'helmet';
import cors from 'cors';

/**
 * Security middleware configuration
 * Apply these middlewares to enhance security
 */

// CORS configuration
export const corsOptions = cors({
  origin: process.env.CLIENT_URL || process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

// Helmet configuration for security headers
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", process.env.API_URL || 'http://localhost:5001'],
    },
  },
  crossOriginEmbedderPolicy: false, // Adjust based on your needs
});

// Rate limiting for authentication endpoints (stricter)
export const authRateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
};

// Rate limiting for general API endpoints
export const apiRateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
};
