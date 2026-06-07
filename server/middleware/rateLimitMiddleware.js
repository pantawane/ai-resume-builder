import rateLimit from 'express-rate-limit';

// 🔒 General API limit - 100 requests per 15 minutes per IP
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    message: 'Too many requests from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 🔒 Auth limit - 10 login attempts per 15 minutes (prevent brute force)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    message: 'Too many login attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 🔒 AI limit - 20 AI requests per hour (prevent API abuse)
export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: {
    message: 'AI request limit reached. You can make 20 AI requests per hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});