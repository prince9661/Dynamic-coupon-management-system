import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to protect routes.
 * Verifies the JWT token from cookies or Authorization header.
 * Attaches the authenticated user to the request object.
 */
export const protect = async (req, res, next) => {
  let token;

  // Check for token in cookies (preferred) or Authorization header (Bearer token)
  token = req.cookies.jwt;
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      // Decode and verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jwt-secret-key');

      // Fetch user from DB and attach to request (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

/**
 * Middleware to restrict access based on user roles.
 * 
 * @param {...string} roles - Allowed roles (e.g., 'admin', 'customer').
 */
export const limitTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role '${req.user ? req.user.role : 'unknown'}' is not authorized to access this route`
      });
    }
    next();
  };
};
