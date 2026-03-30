import { Server } from 'socket.io';

let io;
const onlineUsers = new Map(); // userId -> socketId

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // User comes online
    socket.on('user:online', (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit('users:online', Array.from(onlineUsers.keys()));
    });

    // Join a conversation room
    socket.on('chat:join', (conversationId) => {
      socket.join(conversationId);
    });

    // Leave a conversation room
    socket.on('chat:leave', (conversationId) => {
      socket.leave(conversationId);
    });

    // Typing indicator
    socket.on('chat:typing', ({ conversationId, userId }) => {
      socket.to(conversationId).emit('chat:typing', { conversationId, userId });
    });

    socket.on('chat:stop-typing', ({ conversationId, userId }) => {
      socket.to(conversationId).emit('chat:stop-typing', { conversationId, userId });
    });

    // Disconnect
    socket.on('disconnect', () => {
      // Remove user from online list
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      io.emit('users:online', Array.from(onlineUsers.keys()));
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};

export const getOnlineUsers = () => onlineUsers;

export const emitToUser = (userId, event, data) => {
  const socketId = onlineUsers.get(userId.toString());
  if (socketId) {
    io.to(socketId).emit(event, data);
  }
};
