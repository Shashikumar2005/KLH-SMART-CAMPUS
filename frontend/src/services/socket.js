import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const initializeSocket = (token) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
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
