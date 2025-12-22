// Dashboard containing statistics

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCoupons } from '../store/slices/couponSlice.js';
import { fetchCampaigns } from '../store/slices/campaignSlice.js';
import { fetchOrders } from '../store/slices/orderSlice.js';
import { onCouponUsed } from '../utils/socket.js';

// Dashboard Component
const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { coupons, pagination: couponPagination } = useSelector((state) => state.coupons);
  const { campaigns, pagination: campaignPagination } = useSelector((state) => state.campaigns);
  const { orders, pagination: orderPagination } = useSelector((state) => state.orders);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchCoupons({ page: 1, limit: 5 }));
    dispatch(fetchCampaigns({ page: 1, limit: 5 }));
    dispatch(fetchOrders({ page: 1, limit: 5 }));
  }, [dispatch]);

  // Listen to real-time coupon usage updates
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
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-[#8b949e] text-lg">Welcome back, {user?.username}</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-[#010409] border border-[#30363d] rounded-[12px] p-6 shadow-xl animate-float">
          <h3 className="text-sm font-semibold text-[#8b949e] mb-2 tracking-wide uppercase">Total Coupons</h3>
          <p className="text-4xl font-bold text-white tracking-tight mb-2">{couponPagination.total || 0}</p>
          <p className="text-xs text-[#238636] font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#238636]"></span>
            {activeCoupons} active
          </p>
        </div>

        <div className="bg-[#010409] border border-[#30363d] rounded-[12px] p-6 shadow-xl animate-float" style={{ animationDelay: '1s' }}>
          <h3 className="text-sm font-semibold text-[#8b949e] mb-2 tracking-wide uppercase">Total Campaigns</h3>
          <p className="text-4xl font-bold text-white tracking-tight mb-2">{campaignPagination.total || 0}</p>
          <p className="text-xs text-[#1f6feb] font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#1f6feb]"></span>
            {activeCampaigns} active
          </p>
        </div>

        <div className="bg-[#010409] border border-[#30363d] rounded-[12px] p-6 shadow-xl animate-float" style={{ animationDelay: '2s' }}>
          <h3 className="text-sm font-semibold text-[#8b949e] mb-2 tracking-wide uppercase">Total Orders</h3>
          <p className="text-4xl font-bold text-white tracking-tight mb-2">{orderPagination.total || 0}</p>
          <p className="text-xs text-[#8b949e]">Lifetime volume</p>
        </div>
      </div>

      {/* Recent Coupons */}
      <div className="space-y-6">
        <div className="flex justify-between items-end border-b border-[#30363d] pb-4">
          <h2 className="text-xl font-bold text-white tracking-tight">Recent Coupons</h2>
          <Link
            to="/coupons"
            className="text-[#58a6ff] text-sm font-medium hover:underline transition-colors"
          >
            View All →
          </Link>
        </div>
        <div className="space-y-3">
          {coupons.length > 0 ? (
            coupons.map((coupon) => (
              <div
                key={coupon._id}
                className="group flex justify-between items-center p-4 bg-[#161b22]/50 border border-[#30363d] rounded-[8px] hover:border-[#8b949e] transition-colors"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-white bg-[#30363d]/50 px-2 py-1 rounded text-sm border border-transparent group-hover:border-[#58a6ff]/50 transition-colors">
                      {coupon.code}
                    </span>
                    <span className="text-[#8b949e] text-sm">{coupon.description}</span>
                  </div>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full border ${coupon.isActive
                    ? 'bg-[#238636]/10 text-[#3fb950] border-[#238636]/20'
                    : 'bg-[#30363d]/50 text-[#8b949e] border-[#30363d]'
                    }`}
                >
                  {coupon.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))
          ) : (
            <p className="text-[#8b949e] py-8 text-center italic">No coupons found</p>
          )}
        </div>
      </div>

      {/* Recent Campaigns */}
      <div className="space-y-6">
        <div className="flex justify-between items-end border-b border-[#30363d] pb-4">
          <h2 className="text-xl font-bold text-white tracking-tight">Recent Campaigns</h2>
          <Link
            to="/campaigns"
            className="text-[#58a6ff] text-sm font-medium hover:underline transition-colors"
          >
            View All →
          </Link>
        </div>
        <div className="space-y-3">
          {campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <div
                key={campaign._id}
                className="group flex justify-between items-center p-4 bg-[#161b22]/50 border border-[#30363d] rounded-[8px] hover:border-[#8b949e] transition-colors"
              >
                <div>
                  <span className="font-semibold text-white group-hover:text-[#58a6ff] transition-colors">{campaign.name}</span>
                  <span className="text-[#8b949e] ml-4 text-sm">{campaign.description}</span>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full border ${campaign.isActive
                    ? 'bg-[#1f6feb]/10 text-[#58a6ff] border-[#1f6feb]/20'
                    : 'bg-[#30363d]/50 text-[#8b949e] border-[#30363d]'
                    }`}
                >
                  {campaign.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))
          ) : (
            <p className="text-[#8b949e] py-8 text-center italic">No campaigns found</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {user?.role === 'admin' && (
        <div className="space-y-6 pt-6 border-t border-[#30363d]">
          <h2 className="text-xl font-bold text-white tracking-tight">Quick Actions</h2>
          <div className="flex gap-4">
            <Link
              to="/coupons/new"
              className="bg-[#238636] text-white px-6 py-2.5 rounded-[6px] text-sm font-bold hover:bg-[#2ea043] border border-[rgba(240,246,252,0.1)] transition-colors shadow-sm"
            >
              Create Coupon
            </Link>
            <Link
              to="/campaigns/new"
              className="bg-[#1f6feb] text-white px-6 py-2.5 rounded-[6px] text-sm font-bold hover:bg-[#388bfd] border border-[rgba(240,246,252,0.1)] transition-colors shadow-sm"
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


