import { Router } from 'express';
import { body } from 'express-validator';
import { getProfile, updateProfile, changePassword } from '../controllers/users.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/me', authenticate, getProfile);

router.patch(
  '/me',
  authenticate,
  [
    body('name').optional().isLength({ min: 3 }),
    body('avatar').optional().isURL()
  ],
  validate,
  updateProfile
);

router.post(
  '/me/change-password',
  authenticate,
  [
    body('oldPassword').exists().withMessage('Old password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
  ],
  validate,
  changePassword
);

export default router;
