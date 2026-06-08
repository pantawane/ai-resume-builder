import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  status?: number;
  code?: number;
  keyValue?: Record<string, string>;
  errors?: Record<string, { message: string }>;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(`
  ❌ ERROR: ${err.message}
  📍 Route: ${req.method} ${req.url}
  ⏰ Time: ${new Date().toISOString()}
  `);

  // Mongoose validation error
  if (err.name === 'ValidationError' && err.errors) {
    res.status(400).json({
      message: 'Validation Error',
      errors: Object.values(err.errors).map((e) => e.message)
    });
    return;
  }

  // Mongoose duplicate key
  if (err.code === 11000 && err.keyValue) {
    const field = Object.keys(err.keyValue)[0];
    res.status(400).json({ message: `${field} already exists` });
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({ message: 'Token expired, please login again' });
    return;
  }

  // Default error
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
};

export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new Error(`Route not found: ${req.method} ${req.url}`) as CustomError;
  error.status = 404;
  next(error);
};