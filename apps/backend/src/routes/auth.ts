import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, logout, refreshToken, getMe } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').exists().withMessage('Password is required')
  ],
  validate,
  login
);

router.post('/logout', logout);
router.post('/refresh', refreshToken);
router.get('/me', authenticate, getMe);

export default router;
