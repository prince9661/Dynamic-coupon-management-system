// Main server entry point
// Sets up Express, MongoDB, Socket.IO, and Middleware

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import compression from 'compression';

// Import custom modules
import { setupMongoDB } from './config/mongodb.js';
import { couponEventEmitter } from './utils/eventEmitterInstance.js';
import { setupFileSystem } from './utils/fileSystem.js';
import { setupStreams } from './utils/streams.js';
import apiRoutes from './routes/api.js';
import { setupSocketIO } from './sockets/socketHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Express app setup

// Middleware setup
app.use(compression()); // Compress responses
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Middleware setup
app.use(cookieParser()); // Parse cookies from request headers
app.use(express.json()); // Parse JSON request bodies (replaces body-parser)
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Session configuration for authentication
app.use(session({
  secret: process.env.SESSION_SECRET || 'coupon-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Core Utilities

// Setup file system and streams

// Database Connections
setupMongoDB();

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

setupSocketIO(io, couponEventEmitter);

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Coupon Management System API is running',
    timestamp: new Date().toISOString()
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start Server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
  Coupon Management System running on http://localhost:${PORT}
  Environment: ${process.env.NODE_ENV || 'development'}
  `);
});

export { app, server, io, couponEventEmitter };

