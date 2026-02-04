import client from 'prom-client';

/**
 * Prometheus metrics registry and custom metrics
 * Exposes /metrics endpoint for Prometheus to scrape
 */

// Create a Registry to register the metrics
export const register = new client.Registry();

// Add default metrics (CPU, memory, process info, etc.)
client.collectDefaultMetrics({ 
  register,
  prefix: 'nodejs_', // Prefix for Node.js metrics
});

// HTTP Request Duration Histogram
// Tracks how long HTTP requests take
export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10], // Response time buckets
  registers: [register],
});

// HTTP Request Counter
// Tracks total number of HTTP requests
export const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

// HTTP Error Counter
// Tracks number of HTTP errors (4xx, 5xx)
export const httpRequestErrors = new client.Counter({
  name: 'http_request_errors_total',
  help: 'Total number of HTTP errors',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

// Database Query Duration Histogram
// Tracks database query performance
export const databaseQueryDuration = new client.Histogram({
  name: 'database_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'table'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5], // Query time buckets
  registers: [register],
});

// Active Users Gauge
// Current number of active users
export const activeUsers = new client.Gauge({
  name: 'active_users',
  help: 'Number of active users',
  registers: [register],
});

// Posts Created Counter
// Total number of posts created
export const postsCreated = new client.Counter({
  name: 'posts_created_total',
  help: 'Total number of posts created',
  registers: [register],
});

// Comments Created Counter
// Total number of comments created
export const commentsCreated = new client.Counter({
  name: 'comments_created_total',
  help: 'Total number of comments created',
  registers: [register],
});

// Likes Given Counter
// Total number of likes given
export const likesGiven = new client.Counter({
  name: 'likes_given_total',
  help: 'Total number of likes given',
  registers: [register],
});

// Database Connection Pool Gauge
// Current database connections in pool
export const databaseConnections = new client.Gauge({
  name: 'database_connections',
  help: 'Number of database connections',
  labelNames: ['state'], // 'active', 'idle', 'waiting'
  registers: [register],
});

/**
 * Metrics endpoint handler
 * Returns metrics in Prometheus format
 */
export const metricsHandler = async (req: any, res: any): Promise<void> => {
  try {
    res.set('Content-Type', register.contentType);
    const metrics = await register.metrics();
    res.end(metrics);
  } catch (error) {
    console.error('Error generating metrics:', error);
    res.status(500).end(error instanceof Error ? error.message : 'Error generating metrics');
  }
};
