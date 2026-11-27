import { rateLimit } from 'express-rate-limit';
import { ApiError } from '../utils/api.error';
import constMessages from '../utils/constants';

const FIFTEEN_MINUTES = 15 * 60 * 1000;

// The in-memory store is per process, so switch to a shared store
// (e.g. Redis) before running more than one instance
const createLimiter = (
  limit: number,
  message: string,
  skipSuccessfulRequests = false,
) => {
  return rateLimit({
    windowMs: FIFTEEN_MINUTES,
    limit,
    skipSuccessfulRequests,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (req, res) => {
      const error = ApiError.tooManyRequests(message);
      res.status(error.statusCode).json(error.body);
    },
  });
};

export const rateLimiter = {
  api: createLimiter(300, constMessages.tooManyRequests),
  login: createLimiter(10, constMessages.tooManyLoginAttempts, true),
};
