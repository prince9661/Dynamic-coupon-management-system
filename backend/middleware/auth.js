/**
 * ============================================
 * UNIT III - Middleware: Authentication
 * ============================================
 * 
 * Authentication Middleware:
 * - Protects routes that require authentication
 * - Checks session for user authentication
 * - Demonstrates: app.use(), middleware creation, session handling
 */

/**
 * Middleware to check if user is authenticated
 * Demonstrates: Middleware pattern, session access
 */
export const requireAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    // User is authenticated
    req.userId = req.session.userId;
    req.userRole = req.session.userRole;
    next();
  } else {
    res.status(401).json({ 
      error: 'Authentication required',
      message: 'Please log in to access this resource'
    });
  }
};

/**
 * Middleware to check if user is admin
 * Demonstrates: Role-based access control
 */
export const requireAdmin = (req, res, next) => {
  if (req.session && req.session.userRole === 'admin') {
    req.userId = req.session.userId;
    req.userRole = req.session.userRole;
    next();
  } else {
    res.status(403).json({ 
      error: 'Admin access required',
      message: 'You do not have permission to access this resource'
    });
  }
};

/**
 * Optional authentication middleware
 * Sets user info if available, but doesn't block request
 */
export const optionalAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    req.userId = req.session.userId;
    req.userRole = req.session.userRole;
  }
  next();
};

export default {
  requireAuth,
  requireAdmin,
  optionalAuth
};


