// Admin Orders Page

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrderStatus } from '../store/slices/orderSlice.js';

const AdminOrders = () => {
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
        <div className="space-y-12">
            <h1 className="text-4xl font-bold text-white tracking-tight border-b border-[#30363d] pb-4">All Orders</h1>

            {isLoading ? (
                <div className="text-center py-16">
                    <p className="text-[#8b949e]">Loading orders...</p>
                </div>
            ) : (
                <div className="overflow-hidden border border-[#30363d] rounded-[6px] bg-[#0d1117]">
                    <table className="min-w-full">
                        <thead className="bg-[#161b22] border-b border-[#30363d]">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8b949e] uppercase tracking-wider">Order ID</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8b949e] uppercase tracking-wider">User</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8b949e] uppercase tracking-wider">Coupon</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8b949e] uppercase tracking-wider">Total</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8b949e] uppercase tracking-wider">Discount</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8b949e] uppercase tracking-wider">Final Amount</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8b949e] uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8b949e] uppercase tracking-wider">Actions</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8b949e] uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#30363d]">
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-[#161b22]/50 transition-colors">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                                            #{order._id}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-[white]">
                                            {order.userId?.username || 'Unknown'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                            {order.couponCode ? (
                                                <span className="font-mono bg-[#30363d]/50 text-[#c9d1d9] px-1.5 py-0.5 rounded text-xs">
                                                    {order.couponCode}
                                                </span>
                                            ) : (
                                                <span className="text-[#8b949e]">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-[#8b949e]">
                                            ${parseFloat(order.totalAmount).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-[#3fb950]">
                                            -${parseFloat(order.discountAmount || 0).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-white">
                                            ${parseFloat(order.finalAmount).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span
                                                className={`text-xs font-medium px-2 py-0.5 rounded-full border ${order.status === 'completed'
                                                    ? 'bg-[#238636]/10 text-[#3fb950] border-[#238636]/20'
                                                    : order.status === 'pending'
                                                        ? 'bg-[#9e6a03]/10 text-[#d29922] border-[#9e6a03]/20'
                                                        : 'bg-[#da3633]/10 text-[#f85149] border-[#f85149]/40'
                                                    }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                            {order.status === 'pending' && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => dispatch(updateOrderStatus({ orderId: order._id, status: 'accepted' }))}
                                                        className="bg-[#238636] text-white px-2.5 py-1 rounded-[6px] text-xs font-bold hover:bg-[#2ea043] border border-[rgba(240,246,252,0.1)] transition-colors shadow-sm"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => dispatch(updateOrderStatus({ orderId: order._id, status: 'rejected' }))}
                                                        className="bg-[#da3633] text-white px-2.5 py-1 rounded-[6px] text-xs font-bold hover:bg-[#f85149] border border-[rgba(240,246,252,0.1)] transition-colors shadow-sm"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-[#8b949e]">
                                            {formatDate(order.createdAt)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="px-4 py-16 text-center text-[#8b949e] italic">
                                        No orders found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {pagination.pages > 1 && (
                <div className="flex justify-center items-center space-x-4 pt-6 border-t border-[#30363d]">
                    <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="text-[#58a6ff] text-sm font-medium hover:underline disabled:opacity-50 disabled:no-underline disabled:text-[#8b949e] transition-colors"
                    >
                        ← Previous
                    </button>
                    <span className="text-[#c9d1d9] text-sm">
                        Page {page} of {pagination.pages}
                    </span>
                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={page === pagination.pages}
                        className="text-[#58a6ff] text-sm font-medium hover:underline disabled:opacity-50 disabled:no-underline disabled:text-[#8b949e] transition-colors"
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
