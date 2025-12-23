import express from 'express';
import { registerUser, loginUser, logoutUser, getUserProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { registerValidation } from '../middleware/validation.js';

const router = express.Router();

/**
 * Route: POST /api/auth/register
 * Description: Register a new user
 * Access: Public
 */
router.post('/register', registerValidation, registerUser);

/**
 * Route: POST /api/auth/login
 * Description: Authenticate user and get token
 * Access: Public
 */
router.post('/login', loginUser);

/**
 * Route: POST /api/auth/logout
 * Description: key logout logic (clear cookies)
 * Access: Private (Requires login)
 */
router.post('/logout', protect, logoutUser);

/**
 * Route: GET /api/auth/profile
 * Description: Get current user's profile details
 * Access: Private
 */
router.get('/profile', protect, getUserProfile);

export default router;
