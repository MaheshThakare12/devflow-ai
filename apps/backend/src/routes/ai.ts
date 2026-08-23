import { Router } from 'express';
import { body } from 'express-validator';
import { suggestTasks } from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.post(
  '/suggest-tasks',
  authenticate,
  [
    body('projectTitle').notEmpty().withMessage('projectTitle is required')
  ],
  validate,
  suggestTasks
);

export default router;
