/**
 * ============================================
 * UNIT V - HTTP & Data Fetching: Coupon List
 * ============================================
 * 
 * Coupon List Page:
 * - Displays all coupons with filtering
 * - Demonstrates: Data fetching, pagination, conditional rendering
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCoupons, deleteCoupon, activateCoupon, deactivateCoupon } from '../store/slices/couponSlice.js';

/**
 * CouponList Component
 * Demonstrates: useEffect, useState, data fetching, array methods (map, filter)
 */
const CouponList = () => {
  const dispatch = useDispatch();
  const { coupons, pagination, isLoading, error } = useSelector((state) => state.coupons);
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({
    isActive: '',
    campaignId: '',
    page: 1,
  });

  // Fetch coupons when filters change (UNIT III - useEffect)
  useEffect(() => {
    dispatch(fetchCoupons(filters));
  }, [dispatch, filters]);

  /**
   * Handle filter change
   * Demonstrates: Event handling, state updates
   */
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
      page: 1, // Reset to first page
    });
  };

  /**
   * Handle pagination
   */
  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  /**
   * Handle delete
   * Demonstrates: Async actions, confirmation
   */
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      await dispatch(deleteCoupon(id));
      dispatch(fetchCoupons(filters));
    }
  };

  /**
   * Handle activate/deactivate
   */
  const handleToggleActive = async (coupon) => {
    if (coupon.isActive) {
      await dispatch(deactivateCoupon(coupon._id));
    } else {
      await dispatch(activateCoupon(coupon._id));
    }
    dispatch(fetchCoupons(filters));
  };

  // Format date helper (UNIT I - JavaScript functions)
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-16">
      <div className="flex justify-between items-end border-b border-primary-200 pb-4">
        <h1 className="text-5xl font-bold text-primary-900 tracking-tight">Coupons</h1>
        {user?.role === 'admin' && (
          <Link
            to="/coupons/new"
            className="bg-primary-900 text-white px-8 py-3 text-sm font-medium hover:bg-primary-800 transition-colors"
          >
            Create New Coupon
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="border-b border-primary-200 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-3 tracking-tight">Status</label>
            <select
              name="isActive"
              value={filters.isActive}
              onChange={handleFilterChange}
              className="w-full px-0 py-3 border-0 border-b border-primary-300 bg-transparent focus:outline-none focus:border-primary-900 text-primary-900 text-base"
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-primary-50 border border-primary-200 text-primary-800 px-6 py-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-16">
          <p className="text-primary-600">Loading coupons...</p>
        </div>
      )}

      {/* Coupons List */}
      {!isLoading && (
        <div className="overflow-hidden">
          <table className="min-w-full">
            <thead className="border-b border-primary-200">
              <tr>
                <th className="px-0 py-4 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">Code</th>
                <th className="px-0 py-4 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">Description</th>
                <th className="px-0 py-4 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">Discount</th>
                <th className="px-0 py-4 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">Usage</th>
                <th className="px-0 py-4 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">Expiry</th>
                <th className="px-0 py-4 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">Status</th>
                {user?.role === 'admin' && (
                  <th className="px-0 py-4 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {coupons.length > 0 ? (
                coupons.map((coupon) => (
                  <tr key={coupon._id} className="border-b border-primary-100 hover:opacity-70 transition-opacity">
                    <td className="px-0 py-4 whitespace-nowrap">
                      <span className="font-mono font-semibold text-primary-900">{coupon.code}</span>
                    </td>
                    <td className="px-0 py-4">
                      <div className="text-sm text-primary-900">{coupon.description || 'N/A'}</div>
                      {coupon.campaignId && (
                        <div className="text-xs text-primary-500 mt-1">
                          Campaign: {coupon.campaignId.name || 'N/A'}
                        </div>
                      )}
                    </td>
                    <td className="px-0 py-4 whitespace-nowrap">
                      <span className="text-sm text-primary-900">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}%`
                          : `$${coupon.discountValue}`}
                      </span>
                    </td>
                    <td className="px-0 py-4 whitespace-nowrap text-sm text-primary-600">
                      {coupon.currentUsage} / {coupon.maxUsage || '∞'}
                    </td>
                    <td className="px-0 py-4 whitespace-nowrap text-sm text-primary-600">
                      {formatDate(coupon.expiryDate)}
                    </td>
                    <td className="px-0 py-4 whitespace-nowrap">
                      <span
                        className={`text-xs font-medium ${
                          coupon.isActive
                            ? 'text-primary-600'
                            : 'text-primary-400'
                        }`}
                      >
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    {user?.role === 'admin' && (
                      <td className="px-0 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                        <Link
                          to={`/coupons/edit/${coupon._id}`}
                          className="text-primary-700 hover:text-primary-900 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleToggleActive(coupon)}
                          className="text-primary-700 hover:text-primary-900 transition-colors"
                        >
                          {coupon.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          className="text-primary-700 hover:text-primary-900 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-0 py-16 text-center text-primary-500">
                    No coupons found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-6 pt-8 border-t border-primary-200">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="text-primary-700 text-sm font-medium hover:text-primary-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-primary-600 text-sm">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="text-primary-700 text-sm font-medium hover:text-primary-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CouponList;


