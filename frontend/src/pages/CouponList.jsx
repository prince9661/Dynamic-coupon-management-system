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
    <div className="space-y-12">
      <div className="flex justify-between items-end border-b border-[#30363d] pb-4">
        <h1 className="text-4xl font-bold text-white tracking-tight">Coupons</h1>
        {user?.role === 'admin' && (
          <Link
            to="/coupons/new"
            className="bg-[#238636] text-white px-6 py-2.5 rounded-[6px] text-sm font-bold hover:bg-[#2ea043] border border-[rgba(240,246,252,0.1)] transition-colors shadow-sm"
          >
            Create New Coupon
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="border-b border-[#30363d] pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Status</label>
            <select
              name="isActive"
              value={filters.isActive}
              onChange={handleFilterChange}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30 transition-all shadow-sm"
            >
              <option value="">All Statuses</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-[rgba(255,123,114,0.1)] border border-[rgba(255,123,114,0.4)] text-[#ff7b72] px-4 py-3 rounded-[6px] text-sm">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-16">
          <p className="text-[#8b949e]">Loading coupons...</p>
        </div>
      )}

      {/* Coupons List */}
      {!isLoading && (
        <div className="overflow-hidden border border-[#30363d] rounded-[6px] bg-[#0d1117]">
          <table className="min-w-full">
            <thead className="bg-[#161b22] border-b border-[#30363d]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8b949e] uppercase tracking-wider">Code</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8b949e] uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8b949e] uppercase tracking-wider">Discount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8b949e] uppercase tracking-wider">Usage</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8b949e] uppercase tracking-wider">Expiry</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8b949e] uppercase tracking-wider">Status</th>
                {user?.role === 'admin' && (
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#8b949e] uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363d]">
              {coupons.length > 0 ? (
                coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-[#161b22]/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-mono font-bold text-white bg-[#30363d]/50 px-2 py-1 rounded text-sm border border-transparent">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-white font-medium">{coupon.description || 'N/A'}</div>
                      {coupon.campaignId && (
                        <div className="text-xs text-[#8b949e] mt-1">
                          Campaign: {coupon.campaignId.name || 'N/A'}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm text-[#c9d1d9]">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}%`
                          : `$${coupon.discountValue}`}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#8b949e]">
                      {coupon.currentUsage} / {coupon.maxUsage || '∞'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#8b949e]">
                      {formatDate(coupon.expiryDate)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full border ${coupon.isActive
                            ? 'bg-[#238636]/10 text-[#3fb950] border-[#238636]/20'
                            : 'bg-[#30363d]/50 text-[#8b949e] border-[#30363d]'
                          }`}
                      >
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    {user?.role === 'admin' && (
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-3">
                        <Link
                          to={`/coupons/edit/${coupon._id}`}
                          className="text-[#58a6ff] hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleToggleActive(coupon)}
                          className="text-[#c9d1d9] hover:text-white transition-colors"
                        >
                          {coupon.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          className="text-[#ff7b72] hover:text-[#ff9b8e] transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-16 text-center text-[#8b949e] italic">
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
        <div className="flex justify-center items-center space-x-4 pt-6 border-t border-[#30363d]">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="text-[#58a6ff] text-sm font-medium hover:underline disabled:opacity-50 disabled:no-underline disabled:text-[#8b949e] transition-colors"
          >
            ← Previous
          </button>
          <span className="text-[#c9d1d9] text-sm">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="text-[#58a6ff] text-sm font-medium hover:underline disabled:opacity-50 disabled:no-underline disabled:text-[#8b949e] transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default CouponList;


