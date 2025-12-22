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
    navigate('/');
  };

  return (
    <nav className="bg-[#161b22]/80 backdrop-blur-md border-b border-[#30363d] sticky top-0 z-50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Brand */}
          <Link to="/" className="text-2xl font-bold text-white tracking-tight hover:opacity-70 transition-opacity">
            Coupon Pulse
          </Link>

          {/* Navigation Links */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-8">
              <Link
                to="/dashboard"
                className="text-[#c9d1d9] text-sm font-medium hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/coupons"
                className="text-[#c9d1d9] text-sm font-medium hover:text-white transition-colors"
              >
                Coupons
              </Link>
              <Link
                to="/campaigns"
                className="text-[#c9d1d9] text-sm font-medium hover:text-white transition-colors"
              >
                Campaigns
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/coupons/new"
                  className="text-[#c9d1d9] text-sm font-medium hover:text-white transition-colors"
                >
                  New Coupon
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link
                  to="/admin/orders"
                  className="text-[#c9d1d9] text-sm font-medium hover:text-white transition-colors"
                >
                  All Orders
                </Link>
              )}
              {user?.role !== 'admin' && (
                <>
                  <Link
                    to="/checkout"
                    className="text-[#c9d1d9] text-sm font-medium hover:text-white transition-colors"
                  >
                    Checkout
                  </Link>
                  <Link
                    to="/orders"
                    className="text-[#c9d1d9] text-sm font-medium hover:text-white transition-colors"
                  >
                    Orders
                  </Link>
                </>
              )}

              {/* User Info & Logout */}
              <div className="flex items-center space-x-6 ml-6 pl-6 border-l border-[#30363d]">
                <span className="text-[#8b949e] text-sm">
                  {user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-[#c9d1d9] text-sm font-medium hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-6">
              <Link
                to="/login"
                className="text-white text-sm font-medium hover:text-[#c9d1d9] transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-[#238636] text-white px-6 py-2 rounded-md text-sm font-bold hover:bg-[#2ea043] border border-[rgba(240,246,252,0.1)] transition-colors shadow-sm"
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


