/**
 * ============================================
 * UNIT IV - Forms: Login Form
 * ============================================
 *
 * UI Redesigned to match:
 * - Landingfolio login style
 * - HelloHeco minimal, editorial layout
 *
 * Logic remains UNCHANGED
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../store/slices/authSlice.js';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    const result = await dispatch(login(formData));
    if (login.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-md space-y-12">
        {/* Heading */}
        <div className="space-y-4">
          <h1 className="text-3xl font-medium tracking-tight text-gray-900">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500">
            Please sign in to continue
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-900"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-900"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-900 text-white py-3 text-sm hover:opacity-90 transition disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-sm text-gray-500">
          Don’t have an account?{' '}
          <Link
            to="/register"
            className="text-gray-900 hover:opacity-70 transition"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
