import { Request, Response, NextFunction } from 'express';
import { suggestTasks as aiSuggestTasks } from '../services/ai.service';
import { AppError } from '../middleware/errorHandler';

export const suggestTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectTitle, projectDescription, count } = req.body;
    if (!projectTitle) return next(new AppError('projectTitle is required', 400));

    const tasks = await aiSuggestTasks(projectTitle, projectDescription, count);
    res.status(200).json({ success: true, tasks });
  } catch (err) {
    next(err);
  }
};
