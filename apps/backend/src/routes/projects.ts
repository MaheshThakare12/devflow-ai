import { Router } from 'express';
import { body } from 'express-validator';
import { getProjects, createProject, getProject, updateProject, deleteProject, addMember, removeMember } from '../controllers/projects.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/', authenticate, getProjects);

router.post(
  '/',
  authenticate,
  [
    body('title').notEmpty().withMessage('Title is required').isLength({ min: 2, max: 100 })
  ],
  validate,
  createProject
);

router.get('/:id', authenticate, getProject);
router.patch('/:id', authenticate, updateProject);
router.delete('/:id', authenticate, deleteProject);

router.post(
  '/:id/members',
  authenticate,
  [
    body('email').isEmail().withMessage('Valid email is required')
  ],
  validate,
  addMember
);

router.delete('/:id/members/:userId', authenticate, removeMember);

export default router;
