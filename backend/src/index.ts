import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PORT, FRONTEND_URL } from './config/env';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import projectRoutes from './routes/projects';
import taskRoutes from './routes/tasks';
import aiRoutes from './routes/ai';

const app = express();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    callback(null, true); // allow all origins for hackathon
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req: express.Request, res: express.Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404
app.use('*', (req: express.Request, res: express.Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Start server first, then connect DB
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

connectDB().catch((err) => {
  console.error('MongoDB connection error:', err.message);
  // Don't exit — let server keep running
});
