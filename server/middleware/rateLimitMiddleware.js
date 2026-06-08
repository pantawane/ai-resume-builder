import rateLimit from 'express-rate-limit';

// Skip rate limiting in test environment
const skip = () => process.env.NODE_ENV === 'test';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skip,
  message: { message: 'Too many requests. Please try again after 15 minutes.' }
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skip,
  message: { message: 'Too many login attempts. Please try again after 15 minutes.' }
});

export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  skip,
  message: { message: 'AI request limit reached. You can make 20 AI requests per hour.' }
});