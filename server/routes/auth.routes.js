import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  logout,
  refreshToken,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

router.post(
  '/register',
  authLimiter,
  [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .matches(/^[a-z0-9_-]+$/)
      .withMessage('Username: 3-30 chars, lowercase letters, numbers, hyphens, underscores'),
  ],
  register
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

router.post('/logout', protect, logout);
router.post('/refresh-token', refreshToken);
router.post('/verify-email', verifyEmail);

router.post(
  '/forgot-password',
  authLimiter,
  [body('email').isEmail().normalizeEmail()],
  forgotPassword
);

router.post(
  '/reset-password',
  authLimiter,
  [
    body('token').notEmpty(),
    body('password').isLength({ min: 6 }),
  ],
  resetPassword
);

router.get('/me', protect, getMe);

export default router;
