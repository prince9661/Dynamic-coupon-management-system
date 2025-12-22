import React, { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './store/slices/authSlice.js';
import { setupSocketConnection } from './utils/socket.js';

// Layout Components
import Navbar from './components/layout/Navbar.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';

// Page Components
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
// Register is now handled by Login component
import Dashboard from './pages/Dashboard.jsx';
import CouponList from './pages/CouponList.jsx';
import CouponForm from './pages/CouponForm.jsx';
import CampaignList from './pages/CampaignList.jsx';
import CampaignForm from './pages/CampaignForm.jsx';
import Checkout from './pages/Checkout.jsx';
import Orders from './pages/Orders.jsx';
import AdminOrders from './pages/AdminOrders.jsx';

// Layout Component for authenticated/dashboard pages
const MainLayout = () => (
  <div className="min-h-screen bg-[#0d1117] relative overflow-hidden font-sans selection:bg-[#58a6ff] selection:text-[#0d1117]">
    {/* Background Layers - GitHub Globe/Space Effect */}
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Top Right Violet Glow */}
      <div className="absolute top-[-10%] right-[-5%] w-[70vw] h-[70vw] bg-[#bc8cff] opacity-[0.15] blur-[120px] rounded-full mix-blend-screen"></div>
      {/* Bottom Left Blue Glow */}
      <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-[#58a6ff] opacity-[0.12] blur-[100px] rounded-full mix-blend-screen"></div>
      {/* Lines Pattern (Simulated Globe Grid) */}
      <div className="absolute inset-0 opacity-[0.1]" style={{
        backgroundImage: 'linear-gradient(#30363d 1px, transparent 1px), linear-gradient(90deg, #30363d 1px, transparent 1px)',
        backgroundSize: '80px 80px',
        maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
      }}></div>
    </div>

    <Navbar />
    <main className="container mx-auto px-6 py-16 max-w-7xl relative z-10">
      <Outlet />
    </main>
  </div>
);

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
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans relative overflow-x-hidden">
      {/* Global Background removed - now specific to layouts */}

      <div className="relative z-10">
        <Routes>
          {/* Public Routes - No Layout (Full Screen) */}
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/" element={<Landing />} />

          {/* Protected Routes - Application Layout */}
          <Route element={<MainLayout />}>
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
                <ProtectedRoute requireUser>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute requireUser>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminOrders />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Default route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
