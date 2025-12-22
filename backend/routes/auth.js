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
import { body } from 'express-validator';
import * as authController from '../controllers/authController.js';

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
], authController.register);

/**
 * POST /api/auth/login
 * Login user
 * Demonstrates: POST method, password verification, session creation
 */
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], authController.login);

/**
 * POST /api/auth/logout
 * Logout user
 * Demonstrates: Session destruction
 */
router.post('/logout', authController.logout);

/**
 * GET /api/auth/me
 * Get current user info
 * Demonstrates: Session access, GET method
 */
router.get('/me', authController.getMe);

export default router;


