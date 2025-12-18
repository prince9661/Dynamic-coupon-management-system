/**
 * ============================================
 * UNIT V - HTTP & Data Fetching: Dashboard
 * ============================================
 * 
 * Dashboard Page:
 * - Main dashboard with statistics
 * - Demonstrates: useEffect, data fetching, conditional rendering
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCoupons } from '../store/slices/couponSlice.js';
import { fetchCampaigns } from '../store/slices/campaignSlice.js';
import { fetchOrders } from '../store/slices/orderSlice.js';
import { onCouponUsed } from '../utils/socket.js';

/**
 * Dashboard Component
 * Demonstrates: useEffect, useSelector, data fetching
 */
const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { coupons, pagination: couponPagination } = useSelector((state) => state.coupons);
  const { campaigns, pagination: campaignPagination } = useSelector((state) => state.campaigns);
  const { orders, pagination: orderPagination } = useSelector((state) => state.orders);

  // Fetch data on mount (UNIT III - useEffect, UNIT V - Data fetching)
  useEffect(() => {
    dispatch(fetchCoupons({ page: 1, limit: 5 }));
    dispatch(fetchCampaigns({ page: 1, limit: 5 }));
    dispatch(fetchOrders({ page: 1, limit: 5 }));
  }, [dispatch]);

  // Listen to real-time coupon usage updates (UNIT III - useEffect, Socket.IO)
  useEffect(() => {
    const handleCouponUsed = (data) => {
      console.log('Real-time update:', data);
      // Refresh data when coupon is used
      dispatch(fetchCoupons({ page: 1, limit: 5 }));
    };

    onCouponUsed(handleCouponUsed);

    return () => {
      // Cleanup listener if needed
    };
  }, [dispatch]);

  // Calculate statistics
  const activeCoupons = coupons.filter(c => c.isActive).length;
  const activeCampaigns = campaigns.filter(c => c.isActive).length;

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <div className="space-y-4">
        <h1 className="text-5xl font-bold text-primary-900 tracking-tight">Dashboard</h1>
        <p className="text-primary-600 text-lg">Welcome back, {user?.username}</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="border-b border-primary-200 pb-8">
          <h3 className="text-sm font-medium text-primary-600 mb-6 tracking-tight uppercase">Total Coupons</h3>
          <p className="text-5xl font-bold text-primary-900 tracking-tight mb-2">{couponPagination.total || 0}</p>
          <p className="text-sm text-primary-500">{activeCoupons} active</p>
        </div>

        <div className="border-b border-primary-200 pb-8">
          <h3 className="text-sm font-medium text-primary-600 mb-6 tracking-tight uppercase">Total Campaigns</h3>
          <p className="text-5xl font-bold text-primary-900 tracking-tight mb-2">{campaignPagination.total || 0}</p>
          <p className="text-sm text-primary-500">{activeCampaigns} active</p>
        </div>

        <div className="border-b border-primary-200 pb-8">
          <h3 className="text-sm font-medium text-primary-600 mb-6 tracking-tight uppercase">Total Orders</h3>
          <p className="text-5xl font-bold text-primary-900 tracking-tight mb-2">{orderPagination.total || 0}</p>
        </div>
      </div>

      {/* Recent Coupons */}
      <div className="space-y-8">
        <div className="flex justify-between items-end border-b border-primary-200 pb-4">
          <h2 className="text-2xl font-bold text-primary-900 tracking-tight">Recent Coupons</h2>
          <Link
            to="/coupons"
            className="text-primary-700 text-sm font-medium hover:text-primary-900 transition-colors"
          >
            View All →
          </Link>
        </div>
        <div className="space-y-1">
          {coupons.length > 0 ? (
            coupons.map((coupon) => (
              <div
                key={coupon._id}
                className="flex justify-between items-center py-4 border-b border-primary-100 hover:opacity-70 transition-opacity"
              >
                <div>
                  <span className="font-semibold text-primary-900">{coupon.code}</span>
                  <span className="text-primary-600 ml-4 text-sm">{coupon.description}</span>
                </div>
                <span
                  className={`text-xs font-medium ${
                    coupon.isActive ? 'text-primary-600' : 'text-primary-400'
                  }`}
                >
                  {coupon.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))
          ) : (
            <p className="text-primary-500 py-8">No coupons found</p>
          )}
        </div>
      </div>

      {/* Recent Campaigns */}
      <div className="space-y-8">
        <div className="flex justify-between items-end border-b border-primary-200 pb-4">
          <h2 className="text-2xl font-bold text-primary-900 tracking-tight">Recent Campaigns</h2>
          <Link
            to="/campaigns"
            className="text-primary-700 text-sm font-medium hover:text-primary-900 transition-colors"
          >
            View All →
          </Link>
        </div>
        <div className="space-y-1">
          {campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <div
                key={campaign._id}
                className="flex justify-between items-center py-4 border-b border-primary-100 hover:opacity-70 transition-opacity"
              >
                <div>
                  <span className="font-semibold text-primary-900">{campaign.name}</span>
                  <span className="text-primary-600 ml-4 text-sm">{campaign.description}</span>
                </div>
                <span
                  className={`text-xs font-medium ${
                    campaign.isActive ? 'text-primary-600' : 'text-primary-400'
                  }`}
                >
                  {campaign.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))
          ) : (
            <p className="text-primary-500 py-8">No campaigns found</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {user?.role === 'admin' && (
        <div className="space-y-6 pt-8 border-t border-primary-200">
          <h2 className="text-2xl font-bold text-primary-900 tracking-tight">Quick Actions</h2>
          <div className="flex space-x-4">
            <Link
              to="/coupons/new"
              className="bg-primary-900 text-white px-8 py-3 text-sm font-medium hover:bg-primary-800 transition-colors"
            >
              Create Coupon
            </Link>
            <Link
              to="/campaigns/new"
              className="bg-primary-900 text-white px-8 py-3 text-sm font-medium hover:bg-primary-800 transition-colors"
            >
              Create Campaign
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;


