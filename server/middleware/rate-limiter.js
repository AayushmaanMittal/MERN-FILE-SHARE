const rateLimit = require("express-rate-limit")

// Create a rate limiter for general API requests
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 429,
    message: "Too many requests, please try again later.",
  },
})

// Create a stricter rate limiter for authentication endpoints
exports.authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many login attempts, please try again later.",
  },
})

// Create a rate limiter for file upload endpoints
exports.uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 uploads per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many file uploads, please try again later.",
  },
})
