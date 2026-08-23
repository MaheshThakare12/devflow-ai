import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';
import { User, IUser } from '../models/User';
import { AppError } from './errorHandler';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const verifyToken = async (req: Request) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return null;
  }

  const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
  const user = await User.findById(decoded.id);
  return user;
};

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await verifyToken(req);
    if (!user) {
      return next(new AppError('Not authorized to access this route', 401));
    }
    req.user = user;
    next();
  } catch (err) {
    return next(new AppError('Not authorized to access this route', 401));
  }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await verifyToken(req);
    if (user) {
      req.user = user;
    }
    next();
  } catch (err) {
    next();
  }
};
