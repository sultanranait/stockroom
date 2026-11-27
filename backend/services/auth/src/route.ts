import { rateLimiter } from '@shared/config/rate.limiter';
import { authenticate } from '@shared/middlewares/auth.middleware';
import validate from '@shared/middlewares/validate.middleware';
import { Router } from 'express';
import { body } from 'express-validator';
import { authController } from './controllers/auth.controller';
import constMessages from './utils/constants';

const router = Router();

router.post(
  '/login',
  rateLimiter.login,
  validate([
    body('email')
      .isString()
      .trim()
      .isEmail()
      .withMessage(constMessages.invalidEmail)
      .toLowerCase(),
    body('password')
      .isString()
      .notEmpty()
      .withMessage(constMessages.passwordRequired),
  ]),
  authController.login,
);

router.post('/logout', authController.logout);

router.get('/me', authenticate, authController.me);

export default router;
