const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const socketHandler = require('./socket/socketHandler');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:5173',
      'http://localhost:5174',
    ],
    credentials: true,
  },
});

// Make io accessible to routes
app.set('io', io);

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://localhost:5174',
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/lost-items', require('./routes/lostItems'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/grievances', require('./routes/grievances'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/clubs', require('./routes/clubs'));
app.use('/api/polls', require('./routes/polls'));
app.use('/api/chatbot', require('./routes/chatbot'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Socket.IO connection handler
socketHandler(io);

// Error handler middleware (should be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`);
  httpServer.close(() => process.exit(1));
});
