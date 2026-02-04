import { Request, Response, NextFunction } from 'express';

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Centralized error handler middleware
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error for monitoring
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });

  // Determine status code
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  // Prepare error response
  const errorResponse: {
    success: false;
    error: {
      message: string;
      stack?: string;
    };
  } = {
    success: false,
    error: {
      message:
        process.env.NODE_ENV === 'production' && statusCode === 500
          ? 'Internal server error'
          : err.message,
    },
  };

  // Include stack trace in development
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.error.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 handler for undefined routes
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};
