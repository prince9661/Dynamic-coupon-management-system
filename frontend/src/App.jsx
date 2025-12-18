/**
 * ============================================
 * UNIT I & V - React Basics & Routing
 * ============================================
 * 
 * App Component:
 * - Main application component
 * - Sets up routing
 * - Demonstrates: Functional component, React Router
 */

import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './store/slices/authSlice.js';
import { setupSocketConnection } from './utils/socket.js';

// Layout Components
import Navbar from './components/layout/Navbar.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';

// Page Components
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CouponList from './pages/CouponList.jsx';
import CouponForm from './pages/CouponForm.jsx';
import CampaignList from './pages/CampaignList.jsx';
import CampaignForm from './pages/CampaignForm.jsx';
import Checkout from './pages/Checkout.jsx';
import Orders from './pages/Orders.jsx';

/**
 * App Component (Functional Component)
 * Demonstrates: useState, useEffect hooks, React Router
 */
function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Check authentication on mount (UNIT III - useEffect)
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Setup Socket.IO connection if authenticated (UNIT III - useEffect)
  useEffect(() => {
    if (isAuthenticated) {
      setupSocketConnection(user);
    }
  }, [isAuthenticated, user]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container mx-auto px-6 py-16 max-w-7xl">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coupons"
            element={
              <ProtectedRoute>
                <CouponList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coupons/new"
            element={
              <ProtectedRoute requireAdmin>
                <CouponForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coupons/edit/:id"
            element={
              <ProtectedRoute requireAdmin>
                <CouponForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/campaigns"
            element={
              <ProtectedRoute>
                <CampaignList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/campaigns/new"
            element={
              <ProtectedRoute requireAdmin>
                <CampaignForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/campaigns/edit/:id"
            element={
              <ProtectedRoute requireAdmin>
                <CampaignForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          {/* Default route */}
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          <Route path="*" element={<div className="text-center py-32"><h1 className="text-5xl font-bold tracking-tight">404 - Page Not Found</h1></div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;


