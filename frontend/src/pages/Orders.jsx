/**
 * ============================================
 * UNIT V - HTTP & Data Fetching: Orders Page
 * ============================================
 * 
 * Orders Page:
 * - Displays user orders
 * - Demonstrates: Data fetching, pagination
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../store/slices/orderSlice.js';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, pagination, isLoading } = useSelector((state) => state.orders);

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchOrders({ page }));
  }, [dispatch, page]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-16">
      <h1 className="text-5xl font-bold text-primary-900 tracking-tight border-b border-primary-200 pb-4">My Orders</h1>

      {isLoading ? (
        <div className="text-center py-16">
          <p className="text-primary-600">Loading orders...</p>
        </div>
      ) : (
        <div className="overflow-hidden">
          <table className="min-w-full">
            <thead className="border-b border-primary-200">
              <tr>
                <th className="px-0 py-4 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">Order ID</th>
                <th className="px-0 py-4 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">Coupon</th>
                <th className="px-0 py-4 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">Total</th>
                <th className="px-0 py-4 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">Discount</th>
                <th className="px-0 py-4 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">Final Amount</th>
                <th className="px-0 py-4 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">Status</th>
                <th className="px-0 py-4 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-primary-100 hover:opacity-70 transition-opacity">
                    <td className="px-0 py-4 whitespace-nowrap text-sm font-medium text-primary-900">
                      #{order.id}
                    </td>
                    <td className="px-0 py-4 whitespace-nowrap text-sm text-primary-900">
                      {order.coupon_code || 'N/A'}
                    </td>
                    <td className="px-0 py-4 whitespace-nowrap text-sm text-primary-600">
                      ${parseFloat(order.total_amount).toFixed(2)}
                    </td>
                    <td className="px-0 py-4 whitespace-nowrap text-sm text-primary-600">
                      ${parseFloat(order.discount_amount || 0).toFixed(2)}
                    </td>
                    <td className="px-0 py-4 whitespace-nowrap text-sm font-semibold text-primary-900">
                      ${parseFloat(order.final_amount).toFixed(2)}
                    </td>
                    <td className="px-0 py-4 whitespace-nowrap">
                      <span
                        className={`text-xs font-medium ${
                          order.status === 'completed'
                            ? 'text-primary-600'
                            : order.status === 'pending'
                            ? 'text-primary-500'
                            : 'text-primary-400'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-0 py-4 whitespace-nowrap text-sm text-primary-500">
                      {formatDate(order.created_at)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-0 py-16 text-center text-primary-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-6 pt-8 border-t border-primary-200">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="text-primary-700 text-sm font-medium hover:text-primary-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-primary-600 text-sm">
            Page {page} of {pagination.pages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.pages}
            className="text-primary-700 text-sm font-medium hover:text-primary-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;


