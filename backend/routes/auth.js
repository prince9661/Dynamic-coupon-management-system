/**
 * ============================================
 * UNIT II - Express: Authentication Routes
 * ============================================
 * 
 * Authentication API:
 * - User registration and login
 * - Session management
 * - Demonstrates: POST requests, session handling
 */

import express from 'express';
import User from '../models/User.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 * Demonstrates: POST method, input validation, password hashing
 */
router.post('/register', [
  body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Role must be user or admin')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', errors: errors.array() });
    }

    const { username, email, password, role = 'user' } = req.body;

    // Check if user already exists (UNIT IV - MongoDB CRUD: READ)
    const existingUser = await User.findOne({
      $or: [{ username }, { email: email.toLowerCase() }]
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Create new user (UNIT IV - MongoDB CRUD: CREATE)
    // Password will be hashed by pre-save hook
    const user = new User({
      username,
      email: email.toLowerCase(),
      passwordHash: password, // Will be hashed in pre-save hook
      role
    });

    await user.save();

    // Set session
    req.session.userId = user._id.toString();
    req.session.userRole = user.role;
    req.session.username = user.username;

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed', message: error.message });
  }
});

/**
 * POST /api/auth/login
 * Login user
 * Demonstrates: POST method, password verification, session creation
 */
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user (UNIT IV - MongoDB CRUD: READ)
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password using model method
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Set session
    req.session.userId = user._id.toString();
    req.session.userRole = user.role;
    req.session.username = user.username;

    res.json({
      message: 'Login successful',
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', message: error.message });
  }
});

/**
 * POST /api/auth/logout
 * Logout user
 * Demonstrates: Session destruction
 */
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
});

/**
 * GET /api/auth/me
 * Get current user info
 * Demonstrates: Session access, GET method
 */
router.get('/me', (req, res) => {
  if (req.session && req.session.userId) {
    res.json({
      user: {
        id: req.session.userId,
        username: req.session.username,
        role: req.session.userRole
      }
    });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

export default router;

