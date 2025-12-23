import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

/**
 * Generates a JWT token for the user.
 * 
 * @param {string} id - The user ID.
 * @returns {string} - Signed JWT token.
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'jwt-secret-key', {
        expiresIn: '30d' // Token valid for 30 days
    });
};

/**
 * Register a new user.
 * 
 * @route POST /api/auth/register
 * @access Public
 */
export const registerUser = async (req, res) => {
    try {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password, role } = req.body;

        // Check if user with email already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user (password hashing handled by model middleware)
        const user = await User.create({
            username,
            email,
            password,
            role: role || 'customer'
        });

        if (user) {
            // Create token
            const token = generateToken(user._id);

            // Set cookie with token
            res.cookie('jwt', token, {
                httpOnly: true, // Prevent XSS
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60 * 1000,
                sameSite: 'strict'
            });

            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * Authenticate user & get token (Login).
 * 
 * @route POST /api/auth/login
 * @access Public
 */
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email and explicitly select password field
        const user = await User.findOne({ email }).select('+password');

        // Verify user and password
        if (user && (await user.comparePassword(password))) {
            const token = generateToken(user._id);

            // Set cookie
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60 * 1000,
                sameSite: 'strict'
            });

            // Update last login timestamp
            user.lastLogin = Date.now();
            await user.save();

            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * Logout user / clear cookie.
 * 
 * @route POST /api/auth/logout
 * @access Private
 */
export const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0) // Expire cookie immediately
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

/**
 * Get current user profile.
 * 
 * @route GET /api/auth/profile
 * @access Private
 */
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
