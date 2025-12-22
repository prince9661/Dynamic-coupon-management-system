/**
 * ============================================
 * UNIT II - Components: Navbar Component
 * ============================================
 * 
 * Navbar Component:
 * - Navigation bar for the application
 * - Demonstrates: Functional component, conditional rendering, React Router Link
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice.js';
import { disconnectSocket } from '../../utils/socket.js';

/**
 * Navbar Component (Functional Component)
 * Demonstrates: useState equivalent via Redux, event handling
 */
const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  /**
   * Handle logout
   * Demonstrates: Event handling, async actions
   */
  const handleLogout = async () => {
    disconnectSocket();
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-primary-200">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex justify-between items-center py-6">
          {/* Logo/Brand */}
          <Link to="/" className="text-2xl font-bold text-primary-900 tracking-tight hover:opacity-70 transition-opacity">
            Coupon Manager
          </Link>

          {/* Navigation Links */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-8">
              <Link
                to="/dashboard"
                className="text-primary-700 text-sm font-medium hover:text-primary-900 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/coupons"
                className="text-primary-700 text-sm font-medium hover:text-primary-900 transition-colors"
              >
                Coupons
              </Link>
              <Link
                to="/campaigns"
                className="text-primary-700 text-sm font-medium hover:text-primary-900 transition-colors"
              >
                Campaigns
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/coupons/new"
                  className="text-primary-700 text-sm font-medium hover:text-primary-900 transition-colors"
                >
                  New Coupon
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link
                  to="/admin/orders"
                  className="text-primary-700 text-sm font-medium hover:text-primary-900 transition-colors"
                >
                  All Orders
                </Link>
              )}
              {user?.role !== 'admin' && (
                <>
                  <Link
                    to="/checkout"
                    className="text-primary-700 text-sm font-medium hover:text-primary-900 transition-colors"
                  >
                    Checkout
                  </Link>
                  <Link
                    to="/orders"
                    className="text-primary-700 text-sm font-medium hover:text-primary-900 transition-colors"
                  >
                    Orders
                  </Link>
                </>
              )}

              {/* User Info & Logout */}
              <div className="flex items-center space-x-6 ml-6 pl-6 border-l border-primary-200">
                <span className="text-primary-600 text-sm">
                  {user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-primary-700 text-sm font-medium hover:text-primary-900 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-6">
              <Link
                to="/login"
                className="text-primary-700 text-sm font-medium hover:text-primary-900 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary-900 text-white px-6 py-2 text-sm font-medium hover:bg-primary-800 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


