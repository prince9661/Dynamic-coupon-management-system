/**
 * ============================================
 * UNIT V - Routing: Protected Routes
 * ============================================
 * 
 * Protected Route Component:
 * - Protects routes that require authentication
 * - Can also require admin role
 * - Demonstrates: Route protection, conditional rendering
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication
 * 
 * @param {React.ReactNode} children - Child components to render
 * @param {boolean} requireAdmin - Whether admin role is required
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to dashboard if admin required but user is not admin
  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;


