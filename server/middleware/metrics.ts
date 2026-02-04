import { Request, Response, NextFunction } from 'express';
import { httpRequestDuration, httpRequestTotal, httpRequestErrors } from '../utils/metrics.js';

/**
 * Metrics middleware
 * Tracks HTTP request metrics for Prometheus
 */
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  // Get route path (use route path if available, otherwise use request path)
  const route = req.route?.path || req.path || 'unknown';
  
  // Increment request counter immediately
  // We'll update status_code later, but this gives us request count
  httpRequestTotal.inc({
    method: req.method,
    route: route,
    status_code: 'pending', // Will be updated when response finishes
  });

  // Track response when it finishes
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000; // Convert to seconds
    const statusCode = res.statusCode.toString();

    // Update request counter with actual status code
    httpRequestTotal.inc({
      method: req.method,
      route: route,
      status_code: statusCode,
    });

    // Record request duration
    httpRequestDuration.observe(
      {
        method: req.method,
        route: route,
        status_code: statusCode,
      },
      duration
    );

    // Track errors (4xx and 5xx status codes)
    if (res.statusCode >= 400) {
      httpRequestErrors.inc({
        method: req.method,
        route: route,
        status_code: statusCode,
      });
    }
  });

  next();
};
