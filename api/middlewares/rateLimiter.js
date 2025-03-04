import rateLimit from 'express-rate-limit';
/**
 * API Rate Limiting Middleware
 */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 request per window
    message: 'Too many requests from this IP, please try again later'
});
