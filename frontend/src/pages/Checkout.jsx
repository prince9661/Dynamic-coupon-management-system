/**
 * ============================================
 * UNIT IV & V - Forms & HTTP: Checkout Page
 * ============================================
 * 
 * Checkout Page:
 * - Apply coupons to orders
 * - Real-time coupon validation
 * - Demonstrates: Form handling, Socket.IO, API calls
 */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { validateCoupon, fetchActiveCoupons } from '../store/slices/couponSlice.js';
import { applyCoupon, createOrder } from '../store/slices/orderSlice.js';
import { validateCouponSocket, onCouponValidation, onCouponUsed } from '../utils/socket.js';

/**
 * Checkout Component
 * Demonstrates: useState, useEffect, Socket.IO, form handling
 */
const Checkout = () => {
  const dispatch = useDispatch();
  const { activeCoupons } = useSelector((state) => state.coupons);
  const { user } = useSelector((state) => state.auth);

  const [orderAmount, setOrderAmount] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Fetch active coupons on mount
  useEffect(() => {
    dispatch(fetchActiveCoupons());
  }, [dispatch]);

  // Setup Socket.IO listeners (UNIT III - useEffect, Socket.IO)
  useEffect(() => {
    const handleValidation = (result) => {
      setIsValidating(false);
      setValidationResult(result);
      if (result.valid) {
        setAppliedCoupon(result.coupon);
      }
    };

    onCouponValidation(handleValidation);

    return () => {
      // Cleanup
    };
  }, [couponCode]);

  /**
   * Handle coupon validation
   * Demonstrates: Async operations, Socket.IO usage
   */
  const handleValidateCoupon = async () => {
    if (!couponCode || !orderAmount) {
      alert('Please enter both coupon code and order amount');
      return;
    }

    setIsValidating(true);
    setValidationResult(null);

    // Socket.IO validation removed to prevent race condition with API
    // validateCouponSocket(couponCode, parseFloat(orderAmount));

    // Also validate via API as fallback
    try {
      const result = await dispatch(validateCoupon({
        couponCode,
        amount: parseFloat(orderAmount)
      }));

      if (validateCoupon.fulfilled.match(result)) {
        setValidationResult({
          valid: true,
          coupon: result.payload.coupon,
          calculation: result.payload.calculation
        });
        setAppliedCoupon(result.payload.coupon);
      } else {
        setValidationResult({
          valid: false,
          error: result.payload
        });
      }
    } catch (error) {
      setValidationResult({
        valid: false,
        error: 'Validation failed'
      });
    } finally {
      setIsValidating(false);
    }
  };

  /**
   * Handle apply coupon
   * Demonstrates: API call, async operations
   */
  const handleApplyCoupon = async () => {
    if (!validationResult?.valid || !orderAmount) {
      return;
    }

    try {
      // Create order first
      const orderResult = await dispatch(createOrder({
        totalAmount: parseFloat(orderAmount)
      }));

      if (createOrder.fulfilled.match(orderResult)) {
        const orderId = orderResult.payload.id;

        // Apply coupon
        const applyResult = await dispatch(applyCoupon({
          couponCode,
          amount: parseFloat(orderAmount),
          orderId
        }));

        if (applyCoupon.fulfilled.match(applyResult)) {
          alert('Coupon applied successfully!');
          // Reset form
          setOrderAmount('');
          setCouponCode('');
          setValidationResult(null);
          setAppliedCoupon(null);
        } else {
          alert('Failed to apply coupon: ' + applyResult.payload);
        }
      }
    } catch (error) {
      alert('Error applying coupon: ' + error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pt-8">
      <div className="bg-[#010409] border border-[#30363d] rounded-[12px] p-8 shadow-2xl animate-float">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-8 border-b border-[#30363d] pb-4">Checkout</h1>

        <div className="space-y-8">
          {/* Order Amount Input */}
          <div>
            <label htmlFor="orderAmount" className="block text-sm font-semibold text-white mb-2">
              Order Amount ($)
            </label>
            <input
              type="number"
              id="orderAmount"
              value={orderAmount}
              onChange={(e) => setOrderAmount(e.target.value)}
              min="0"
              step="0.01"
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30 transition-all shadow-sm placeholder-[#484f58]"
              placeholder="Enter order amount"
            />
          </div>

          {/* Coupon Code Input */}
          <div>
            <label htmlFor="couponCode" className="block text-sm font-semibold text-white mb-2">
              Coupon Code
            </label>
            <div className="flex space-x-3">
              <input
                type="text"
                id="couponCode"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30 transition-all shadow-sm placeholder-[#484f58]"
                placeholder="Enter coupon code"
              />
              <button
                type="button"
                onClick={handleValidateCoupon}
                disabled={isValidating || !couponCode || !orderAmount}
                className="bg-[#238636] text-white px-6 py-2 rounded-[6px] text-sm font-bold hover:bg-[#2ea043] border border-[rgba(240,246,252,0.1)] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isValidating ? 'Validating...' : 'Validate'}
              </button>
            </div>
          </div>

          {/* Validation Result */}
          {validationResult && (
            <div
              className={`p-4 rounded-[6px] border ${validationResult.valid
                ? 'bg-[#238636]/10 border-[#238636]/40'
                : 'bg-[#da3633]/10 border-[#f85149]/40'
                }`}
            >
              {validationResult.valid ? (
                <div className="space-y-4">
                  <div className="flex items-center text-[#3fb950] font-semibold">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Coupon Valid!
                  </div>
                  <div className="space-y-1 text-sm pl-7">
                    <p className="text-[#c9d1d9]">
                      Discount: <span className="font-bold text-white">${validationResult.calculation?.discountAmount || 0}</span>
                    </p>
                    <p className="text-[#c9d1d9]">
                      Final Amount: <span className="font-bold text-white">${validationResult.calculation?.finalAmount || orderAmount}</span>
                    </p>
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    className="w-full bg-[#1f6feb] text-white py-2.5 rounded-[6px] text-sm font-bold hover:bg-[#388bfd] border border-[rgba(240,246,252,0.1)] transition-colors shadow-sm mt-4"
                  >
                    Apply Coupon & Place Order
                  </button>
                </div>
              ) : (
                <div className="flex items-center text-[#ff7b72]">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {validationResult.error || 'Invalid coupon'}
                </div>
              )}
            </div>
          )}

          {/* Available Coupons */}
          <div className="space-y-4 pt-6 border-t border-[#30363d]">
            <h3 className="text-xl font-bold text-white tracking-tight">Available Coupons</h3>
            <div className="space-y-3">
              {activeCoupons.length > 0 ? (
                activeCoupons.map((coupon) => (
                  <div
                    key={coupon._id}
                    className="flex justify-between items-center p-4 bg-[#161b22]/50 border border-[#30363d] rounded-[6px] hover:border-[#8b949e] transition-colors group"
                  >
                    <div>
                      <span className="font-mono font-bold text-white bg-[#30363d]/50 px-2 py-1 rounded text-sm mr-3">
                        {coupon.code}
                      </span>
                      <span className="text-[#8b949e] text-sm group-hover:text-[#c9d1d9] transition-colors">{coupon.description}</span>
                    </div>
                    <button
                      onClick={() => {
                        setCouponCode(coupon.code);
                        if (orderAmount) {
                          // We can't immediately validate here because React state updates are async
                          // But setting code is enough for user to just click validate
                        }
                      }}
                      className="text-[#58a6ff] text-sm font-medium hover:underline"
                    >
                      Use
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-[#8b949e] py-4 italic">No active coupons available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;


