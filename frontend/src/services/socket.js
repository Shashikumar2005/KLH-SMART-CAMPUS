import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const initializeSocket = (token) => {
  if (!socket || !socket.connected) {
    socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10,
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected successfully');
      console.log('🔌 Socket ID:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('🔴 Socket connection error:', error.message);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
    });

    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('🔄 Attempting to reconnect...', attemptNumber);
    });

    socket.on('reconnect_error', (error) => {
      console.error('🔴 Reconnection error:', error.message);
    });

    socket.on('reconnect_failed', () => {
      console.error('🔴 Socket reconnection failed');
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

export const subscribeToEvent = (eventName, callback) => {
  if (socket) {
    socket.on(eventName, callback);
  }
};

export const unsubscribeFromEvent = (eventName, callback) => {
  if (socket) {
    socket.off(eventName, callback);
  }
};

export const emitEvent = (eventName, data) => {
  if (socket) {
    socket.emit(eventName, data);
  }
};

export const joinEventRoom = (eventId) => {
  if (socket) {
    socket.emit('joinEvent', eventId);
  }
};

export const leaveEventRoom = (eventId) => {
  if (socket) {
    socket.emit('leaveEvent', eventId);
  }
};

export default {
  initializeSocket,
  disconnectSocket,
  getSocket,
  subscribeToEvent,
  unsubscribeFromEvent,
  emitEvent,
  joinEventRoom,
  leaveEventRoom,
};
