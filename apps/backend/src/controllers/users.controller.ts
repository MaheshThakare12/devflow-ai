import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?.id);
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user?.id, { name, avatar }, { new: true, runValidators: true });
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user?.id).select('+password');
    if (!user) return next(new AppError('User not found', 404));

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) return next(new AppError('Incorrect old password', 401));

    user.password = newPassword;
    await user.save();
    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};
