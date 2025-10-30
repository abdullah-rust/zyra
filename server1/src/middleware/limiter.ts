import rateLimit from "express-rate-limit";
import logger from "../logger";

/**
 * Global reusable rate limiter middleware
 * Designed for auth endpoints (Login, Signup, OTP)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 5, // Max 5 requests per IP per window
  message: {
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.warn(
      `Rate limit exceeded for IP: ${req.ip}, URL: ${req.originalUrl}`
    );
    res.status(429).json({
      message: "Too many attempts, slow down.",
    });
  },
});
