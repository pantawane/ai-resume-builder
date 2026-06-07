// Global error handler - catches ALL errors in the app
const errorHandler = (err, req, res, next) => {
  // Log the error with details
  console.error(`
  ❌ ERROR: ${err.message}
  📍 Route: ${req.method} ${req.url}
  👤 User: ${req.userId || 'Not authenticated'}
  ⏰ Time: ${new Date().toISOString()}
  📋 Stack: ${err.stack}
  `);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      message: `${field} already exists`
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired, please login again' });
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large. Maximum size is 5MB' });
  }

  // Default error
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// 404 handler - when route not found
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.url}`);
  error.status = 404;
  next(error);
};

export { errorHandler, notFound };