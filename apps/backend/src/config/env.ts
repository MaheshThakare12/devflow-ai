import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskflow';
export const JWT_SECRET = process.env.JWT_SECRET || 'secret'; // Required in prod
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
