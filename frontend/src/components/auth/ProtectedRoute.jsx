import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * HOC to protect routes from unauthenticated access.
 * Also handles Role-Based Access Control (RBAC).
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children - The child component to render if allowed.
 * @param {boolean} [props.requireAdmin] - If true, only admins can access.
 * @param {boolean} [props.requireUser] - If true, only regular users can access.
 */
const ProtectedRoute = ({ children, requireAdmin = false, requireUser = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // If not logged in, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If Admin required but user is not admin, redirect to dashboard
  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // If User required but user is admin (e.g., preventing Admins from 'buying' stuff in user view), redirect
  if (requireUser && user?.role === 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Access allowed
  return children;
};

export default ProtectedRoute;
