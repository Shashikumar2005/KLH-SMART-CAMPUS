// Socket.IO event handlers for real-time updates
const jwt = require('jsonwebtoken');

const socketHandler = (io) => {
  // Middleware to authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join room based on user role
    socket.join(socket.userRole);
    socket.join(`user:${socket.userId}`);

    // Handle user joining specific event room
    socket.on('joinEvent', (eventId) => {
      socket.join(`event:${eventId}`);
      console.log(`User ${socket.userId} joined event: ${eventId}`);
    });

    // Handle user leaving event room
    socket.on('leaveEvent', (eventId) => {
      socket.leave(`event:${eventId}`);
      console.log(`User ${socket.userId} left event: ${eventId}`);
    });

    // Handle typing indicator for chatbot
    socket.on('typing', (data) => {
      socket.to(`user:${data.userId}`).emit('userTyping', {
        userId: socket.userId,
        isTyping: data.isTyping,
      });
    });

    // Handle notification acknowledgment
    socket.on('notificationRead', (notificationId) => {
      console.log(`Notification ${notificationId} read by user ${socket.userId}`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });

    // Send welcome notification
    socket.emit('notification', {
      type: 'info',
      message: 'Connected to Smart Campus real-time updates',
      timestamp: new Date(),
    });
  });

  // Helper function to emit events to specific roles
  io.emitToRole = (role, event, data) => {
    io.to(role).emit(event, data);
  };

  // Helper function to emit events to specific user
  io.emitToUser = (userId, event, data) => {
    io.to(`user:${userId}`).emit(event, data);
  };

  return io;
};

module.exports = socketHandler;
