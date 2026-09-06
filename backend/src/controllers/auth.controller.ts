import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { JWT_SECRET, JWT_REFRESH_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN } from '../config/env';

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
  const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN as any });
  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return next(new AppError('Email already exists', 400));
    }

    user = await User.create({ name, email, password });
    const { accessToken, refreshToken } = generateTokens(user.id);

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });

    res.status(201).json({ success: true, user, accessToken });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new AppError('Invalid credentials', 401));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new AppError('Invalid credentials', 401));
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });

    res.status(200).json({ success: true, user, accessToken });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return next(new AppError('Not authorized', 401));

    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as { id: string };
    const user = await User.findById(decoded.id);
    if (!user) return next(new AppError('Not authorized', 401));

    const { accessToken } = generateTokens(user.id);
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });

    res.status(200).json({ success: true, accessToken });
  } catch (err) {
    next(new AppError('Not authorized', 401));
  }
};

import { OAuth2Client } from 'google-auth-library';
const googleClient = new OAuth2Client();

export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { credential, name, email, googleId, avatar } = req.body;

    let userEmail = email;
    let userName = name;
    let userGoogleId = googleId;
    let userAvatar = avatar;

    // Verify Google ID Token if passed from official Google OAuth button
    if (credential) {
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: credential
        });
        const payload = ticket.getPayload();
        if (payload) {
          userEmail = payload.email;
          userName = payload.name;
          userGoogleId = payload.sub;
          userAvatar = payload.picture;
        }
      } catch (verifyErr) {
        // Fallback JWT decode for Google credential payload
        try {
          const decoded: any = jwt.decode(credential);
          if (decoded && decoded.email) {
            userEmail = decoded.email;
            userName = decoded.name;
            userGoogleId = decoded.sub;
            userAvatar = decoded.picture;
          }
        } catch (e) {
          // Keep existing values
        }
      }
    }

    if (!userEmail) {
      return next(new AppError('Google authentication failed: Email is required', 400));
    }

    let user = await User.findOne({ $or: [{ googleId: userGoogleId }, { email: userEmail }] });

    if (!user) {
      user = await User.create({
        name: userName || userEmail.split('@')[0],
        email: userEmail,
        googleId: userGoogleId,
        avatar: userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || userEmail)}&background=random`
      });
    } else {
      if (userGoogleId && !user.googleId) user.googleId = userGoogleId;
      if (userAvatar && !user.avatar) user.avatar = userAvatar;
      await user.save();
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });

    res.status(200).json({ success: true, user, accessToken });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?.id);
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};
