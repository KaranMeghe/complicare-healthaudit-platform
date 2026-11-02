/** @format */

import { rateLimit, ipKeyGenerator } from 'express-rate-limit';

// Account + IP limiter
export const loginAccountLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,

  keyGenerator: (req) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const ip = ipKeyGenerator(req.ip ?? req.socket.remoteAddress ?? 'unknown');
    return `${ip}:${email || '__missing_email__'}`;
  },

  skipSuccessfulRequests: true,

  standardHeaders: true,
  legacyHeaders: false,
});

// IP-only limiter
export const loginIpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,

  standardHeaders: true,
  legacyHeaders: false,
});
