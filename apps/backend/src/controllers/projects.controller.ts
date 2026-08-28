import { Request, Response, NextFunction } from 'express';
import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { suggestTasks } from '../services/ai.service';

export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user?._id }, { members: req.user?._id }]
    }).populate('owner', 'name email').lean();

    const result = await Promise.all(projects.map(async (p) => {
      const taskCount = await Task.countDocuments({ project: p._id });
      return { ...p, taskCount };
    }));

    res.status(200).json({ success: true, projects: result });
  } catch (err) {
    next(err);
  }
};

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, color, emoji } = req.body;
    const project = await Project.create({
      title, description, color, emoji, owner: req.user?._id
    });

    // Auto-generate initial AI tasks for the project
    try {
      const generatedTasks = await suggestTasks(title, description, 5);
      if (Array.isArray(generatedTasks) && generatedTasks.length > 0) {
        const tasksToCreate = generatedTasks.map((t: any, index: number) => ({
          title: t.title,
          description: t.description || '',
          project: project._id,
          createdBy: req.user?._id,
          priority: (t.priority || 'medium').toLowerCase(),
          status: 'todo',
          tags: t.tags || [],
          order: index
        }));
        await Task.insertMany(tasksToCreate);
      }
    } catch (aiErr) {
      console.error('Auto AI Task Generation Error:', aiErr);
    }

    res.status(201).json({ success: true, project });
  } catch (err) {
    next(err);
  }
};


export const getProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');

    if (!project) return next(new AppError('Project not found', 404));

    const isOwner = project.owner._id.toString() === req.user?.id;
    const isMember = project.members.some(m => (m as any)._id.toString() === req.user?.id);

    if (!isOwner && !isMember) return next(new AppError('Not authorized', 403));

    res.status(200).json({ success: true, project });
  } catch (err) {
    next(err);
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return next(new AppError('Project not found', 404));
    
    if (project.owner.toString() !== req.user?.id) {
      return next(new AppError('Not authorized', 403));
    }

    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, project: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return next(new AppError('Project not found', 404));

    if (project.owner.toString() !== req.user?.id) {
      return next(new AppError('Not authorized', 403));
    }

    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    res.status(200).json({ success: true, message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
};

export const addMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return next(new AppError('Project not found', 404));
    if (project.owner.toString() !== req.user?.id) return next(new AppError('Not authorized', 403));

    const user = await User.findOne({ email });
    if (!user) return next(new AppError('User not found', 404));
    
    if (project.members.some((m: any) => m.toString() === user.id)) {
      return next(new AppError('User is already a member', 400));
    }

    (project.members as any).push(user.id);
    await project.save();

    res.status(200).json({ success: true, project });
  } catch (err) {
    next(err);
  }
};

export const removeMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return next(new AppError('Project not found', 404));
    if (project.owner.toString() !== req.user?.id) return next(new AppError('Not authorized', 403));

    (project.members as any) = project.members.filter((m: any) => m.toString() !== req.params.userId);
    await project.save();

    res.status(200).json({ success: true, project });
  } catch (err) {
    next(err);
  }
};
