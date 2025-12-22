
import User from '../models/User.js';
import { validationResult } from 'express-validator';

/**
 * Register a new user
 */
export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Validation failed', errors: errors.array() });
        }

        const { username, email, password, role = 'user' } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ username }, { email: email.toLowerCase() }]
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        // Create new user
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
};

/**
 * Login user
 */
export const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Validation failed', errors: errors.array() });
        }

        const { email, password } = req.body;

        // Find user
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Verify password
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
};

/**
 * Logout user
 */
export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logout successful' });
    });
};

/**
 * Get current user info
 */
export const getMe = (req, res) => {
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
};
