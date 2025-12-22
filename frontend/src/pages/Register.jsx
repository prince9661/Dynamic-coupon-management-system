/**
 * ============================================
 * UNIT IV - Forms: Registration Form
 * ============================================
 * 
 * Register Page:
 * - User registration form
 * - Demonstrates: Controlled inputs, form validation
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../store/slices/authSlice.js';

/**
 * Register Component
 * Demonstrates: useState, controlled inputs, form handling
 */
const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  // Form state (UNIT III - useState)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });

  const [validationError, setValidationError] = useState('');

  // Redirect if already authenticated
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

  /**
   * Handle input change
   * Demonstrates: Controlled input pattern
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setValidationError('');
  };

  /**
   * Handle form submission
   * Demonstrates: Form validation, async actions
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    setValidationError('');

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    const { confirmPassword, ...registerData } = formData;
    const result = await dispatch(register(registerData));

    if (register.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-white py-16">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-primary-900 tracking-tight mb-4">Register</h1>
          <p className="text-primary-600 text-sm">Create your account to get started</p>
        </div>

        {(error || validationError) && (
          <div className="bg-primary-50 border border-primary-200 text-primary-800 px-6 py-4 mb-8">
            {error || validationError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-primary-900 mb-3 tracking-tight">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-0 py-3 border-0 border-b border-primary-300 bg-transparent focus:outline-none focus:border-primary-900 text-primary-900 placeholder-primary-400 text-base"
              placeholder="Enter your username"
            />
          </div>

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

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-primary-900 mb-3 tracking-tight">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-0 py-3 border-0 border-b border-primary-300 bg-transparent focus:outline-none focus:border-primary-900 text-primary-900 text-base"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-primary-900 mb-3 tracking-tight">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-0 py-3 border-0 border-b border-primary-300 bg-transparent focus:outline-none focus:border-primary-900 text-primary-900 placeholder-primary-400 text-base"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-900 text-white py-4 px-6 text-sm font-medium hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-12"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-primary-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-900 font-medium hover:opacity-70 transition-opacity">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;


