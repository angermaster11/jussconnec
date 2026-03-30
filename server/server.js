import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import connectDB from './config/db.js';
import { initSocket } from './config/socket.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';
import { apiLimiter } from './middleware/rateLimiter.middleware.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import commentRoutes from './routes/comment.routes.js';
import connectionRoutes, { followRouter } from './routes/connection.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import messageRoutes from './routes/message.routes.js';

const app = express();
const httpServer = createServer(app);

// Connect to MongoDB
connectDB();

// Initialize Socket.io
initSocket(httpServer);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/follow', followRouter);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'JussConnecc API is running 🚀' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`
🚀 JussConnecc Server running in ${process.env.NODE_ENV} mode
📡 Port: ${PORT}
🌐 URL: http://localhost:${PORT}
  `);
});

export default app;
