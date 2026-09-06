import { Router } from 'express';
import { body } from 'express-validator';
import { getTasks, createTask, getTask, updateTask, deleteTask, reorderTasks } from '../controllers/tasks.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/', authenticate, getTasks);

router.post(
  '/',
  authenticate,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('projectId').notEmpty().withMessage('projectId is required')
  ],
  validate,
  createTask
);

router.post('/reorder', authenticate, reorderTasks);

router.get('/:id', authenticate, getTask);
router.patch('/:id', authenticate, updateTask);
router.delete('/:id', authenticate, deleteTask);

export default router;
