import { Request, Response, NextFunction } from 'express';
import { Task } from '../models/Task';
import { Project } from '../models/Project';
import { AppError } from '../middleware/errorHandler';

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId, status, priority, assigneeId, search, sortBy, order } = req.query;
    if (!projectId) return next(new AppError('projectId is required', 400));

    const project = await Project.findById(projectId);
    if (!project) return next(new AppError('Project not found', 404));

    const isOwner = project.owner.toString() === req.user?.id;
    const isMember = project.members.some(m => m.toString() === req.user?.id);
    if (!isOwner && !isMember) return next(new AppError('Not authorized', 403));

    let filter: any = { project: projectId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assigneeId) filter.assignee = assigneeId;
    if (search) filter.title = { $regex: search, $options: 'i' };

    let sort: any = { order: 1 };
    if (sortBy) {
      sort = {};
      sort[sortBy as string] = order === 'desc' ? -1 : 1;
    }

    const tasks = await Task.find(filter)
      .populate('assignee', 'name email avatar')
      .sort(sort);

    res.status(200).json({ success: true, tasks });
  } catch (err) {
    next(err);
  }
};

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.body;
    const project = await Project.findById(projectId);
    if (!project) return next(new AppError('Project not found', 404));

    const isOwner = project.owner.toString() === req.user?.id;
    const isMember = project.members.some(m => m.toString() === req.user?.id);
    if (!isOwner && !isMember) return next(new AppError('Not authorized', 403));

    const task = await Task.create({
      ...req.body,
      project: projectId,
      createdBy: req.user?.id
    });
    res.status(201).json({ success: true, task });
  } catch (err) {
    next(err);
  }
};

export const getTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee', 'name email avatar')
      .populate('createdBy', 'name email avatar');
    if (!task) return next(new AppError('Task not found', 404));

    const project = await Project.findById(task.project);
    if (!project) return next(new AppError('Project not found', 404));

    const isOwner = project.owner.toString() === req.user?.id;
    const isMember = project.members.some(m => m.toString() === req.user?.id);
    if (!isOwner && !isMember) return next(new AppError('Not authorized', 403));

    res.status(200).json({ success: true, task });
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return next(new AppError('Task not found', 404));

    const project = await Project.findById(task.project);
    const isOwner = project?.owner.toString() === req.user?.id;
    const isMember = project?.members.some(m => m.toString() === req.user?.id);
    if (!isOwner && !isMember) return next(new AppError('Not authorized', 403));

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, task: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return next(new AppError('Task not found', 404));

    const project = await Project.findById(task.project);
    const isProjectOwner = project?.owner.toString() === req.user?.id;
    const isTaskOwner = task.createdBy.toString() === req.user?.id;
    
    if (!isProjectOwner && !isTaskOwner) return next(new AppError('Not authorized', 403));

    await task.deleteOne();
    res.status(200).json({ success: true, message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};

export const reorderTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { updates } = req.body; // array of { id, order }
    if (!Array.isArray(updates)) return next(new AppError('Invalid data', 400));

    // Assume user has permissions, ideally we'd check each task's project
    for (const update of updates) {
      await Task.findByIdAndUpdate(update.id, { order: update.order });
    }

    res.status(200).json({ success: true, message: 'Tasks reordered' });
  } catch (err) {
    next(err);
  }
};
