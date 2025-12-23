import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import compression from 'compression';

import { setupMongoDB } from './config/mongodb.js';
import { couponEventEmitter } from './utils/eventEmitterInstance.js';
import apiRoutes from './routes/api.js';
import { setupSocketIO } from './sockets/socketHandler.js';

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Enable gzip compression for better performance
app.use(compression());

// Configure CORS to allow requests from the frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Setup middleware
app.use(cookieParser()); // Parse cookies from request headers
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'coupon-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Secure cookies in production
    httpOnly: true, // Prevent client-side JS from accessing cookies
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Database Connection
setupMongoDB();

// Initialize Socket.IO server with CORS configuration
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Setup Socket.IO event handlers
setupSocketIO(io, couponEventEmitter);

// Mount API routes
app.use('/api', apiRoutes);

// Health check endpoint to verify server status
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Coupon Management System API is running',
    timestamp: new Date().toISOString()
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  // Return standard error response
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
  Coupon Management System running on http://localhost:${PORT}
  Environment: ${process.env.NODE_ENV || 'development'}
  `);
});

// Export instances for testing or external use
export { app, server, io, couponEventEmitter };
