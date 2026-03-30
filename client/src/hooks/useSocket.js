import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { addNotification } from '../features/notifications/notificationsSlice';
import { addMessage, setTyping, markMessagesRead } from '../features/messages/messagesSlice';

const SOCKET_URL = import.meta.env.VITE_API_URL || '';

let socket = null;

export const getSocket = () => socket;

export const useSocket = (user) => {
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        socket = null;
      }
      return;
    }

    // Connect
    socketRef.current = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });
    socket = socketRef.current;

    socketRef.current.on('connect', () => {
      console.log('🔌 Socket connected');
      socketRef.current.emit('user:online', user._id);
    });

    // Notifications
    socketRef.current.on('notification:new', (notification) => {
      dispatch(addNotification(notification));
    });

    // Messages
    socketRef.current.on('chat:message', (message) => {
      dispatch(addMessage(message));
    });

    socketRef.current.on('chat:new-message', ({ message, conversationId }) => {
      dispatch(addMessage(message));
    });

    socketRef.current.on('chat:typing', ({ conversationId, userId }) => {
      dispatch(setTyping({ conversationId, userId, isTyping: true }));
    });

    socketRef.current.on('chat:stop-typing', ({ conversationId, userId }) => {
      dispatch(setTyping({ conversationId, userId, isTyping: false }));
    });

    socketRef.current.on('chat:read', ({ conversationId }) => {
      dispatch(markMessagesRead({ conversationId }));
    });

    socketRef.current.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        socket = null;
      }
    };
  }, [user, dispatch]);

  return socketRef.current;
};
