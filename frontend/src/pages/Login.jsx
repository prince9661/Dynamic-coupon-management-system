/**
 * ============================================
 * UNIT IV - Forms: Login Form
 * ============================================
 * 
 * Login Page:
 * - User login form
 * - Demonstrates: Controlled inputs, form validation, error handling
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../store/slices/authSlice.js';

/**
 * Login Component
 * Demonstrates: useState, useEffect, controlled inputs, form handling
 */
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  // Form state (UNIT III - useState)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Redirect if already authenticated (UNIT III - useEffect)
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  /**
   * Handle input change
   * Demonstrates: Controlled input pattern
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Handle form submission
   * Demonstrates: Form submission, async actions
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    
    const result = await dispatch(login(formData));
    if (login.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-white py-16">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-primary-900 tracking-tight mb-4">Login</h1>
          <p className="text-primary-600 text-sm">Welcome back to your account</p>
        </div>
        
        {error && (
          <div className="bg-primary-50 border border-primary-200 text-primary-800 px-6 py-4 mb-8">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Email Input - Controlled Component */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-primary-900 mb-3 tracking-tight">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-0 py-3 border-0 border-b border-primary-300 bg-transparent focus:outline-none focus:border-primary-900 text-primary-900 placeholder-primary-400 text-base"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Input - Controlled Component */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-primary-900 mb-3 tracking-tight">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-0 py-3 border-0 border-b border-primary-300 bg-transparent focus:outline-none focus:border-primary-900 text-primary-900 placeholder-primary-400 text-base"
              placeholder="Enter your password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-900 text-white py-4 px-6 text-sm font-medium hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-12"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-primary-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-900 font-medium hover:opacity-70 transition-opacity">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;


