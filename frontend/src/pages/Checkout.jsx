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

    const handleCouponUsed = (data) => {
      console.log('Coupon used in real-time:', data);
      if (data.data.couponCode === couponCode) {
        alert('This coupon was just used by another user!');
        setValidationResult(null);
        setAppliedCoupon(null);
      }
    };

    onCouponValidation(handleValidation);
    onCouponUsed(handleCouponUsed);

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

    // Try Socket.IO validation first
    validateCouponSocket(couponCode, parseFloat(orderAmount));

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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-5xl font-bold text-primary-900 tracking-tight mb-16 border-b border-primary-200 pb-4">Checkout</h1>

      <div className="space-y-12">
        {/* Order Amount Input */}
        <div>
          <label htmlFor="orderAmount" className="block text-sm font-medium text-primary-900 mb-3 tracking-tight">
            Order Amount ($)
          </label>
          <input
            type="number"
            id="orderAmount"
            value={orderAmount}
            onChange={(e) => setOrderAmount(e.target.value)}
            min="0"
            step="0.01"
            className="w-full px-0 py-3 border-0 border-b border-primary-300 bg-transparent focus:outline-none focus:border-primary-900 text-primary-900 placeholder-primary-400 text-base"
            placeholder="Enter order amount"
          />
        </div>

        {/* Coupon Code Input */}
        <div>
          <label htmlFor="couponCode" className="block text-sm font-medium text-primary-900 mb-3 tracking-tight">
            Coupon Code
          </label>
          <div className="flex space-x-4">
            <input
              type="text"
              id="couponCode"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="flex-1 px-0 py-3 border-0 border-b border-primary-300 bg-transparent focus:outline-none focus:border-primary-900 text-primary-900 placeholder-primary-400 text-base"
              placeholder="Enter coupon code"
            />
            <button
              type="button"
              onClick={handleValidateCoupon}
              disabled={isValidating || !couponCode || !orderAmount}
              className="bg-primary-900 text-white px-8 py-3 text-sm font-medium hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isValidating ? 'Validating...' : 'Validate'}
            </button>
          </div>
        </div>

        {/* Validation Result */}
        {validationResult && (
          <div
            className={`p-6 border ${
              validationResult.valid
                ? 'border-primary-200 bg-primary-50'
                : 'border-primary-200 bg-primary-50'
            }`}
          >
            {validationResult.valid ? (
              <div className="space-y-4">
                <p className="font-semibold text-primary-900">✓ Coupon Valid!</p>
                <div className="space-y-2 text-sm">
                  <p className="text-primary-600">
                    Discount: <span className="font-semibold text-primary-900">${validationResult.calculation?.discountAmount || 0}</span>
                  </p>
                  <p className="text-primary-600">
                    Final Amount: <span className="font-semibold text-primary-900">${validationResult.calculation?.finalAmount || orderAmount}</span>
                  </p>
                </div>
                <button
                  onClick={handleApplyCoupon}
                  className="bg-primary-900 text-white px-8 py-3 text-sm font-medium hover:bg-primary-800 transition-colors mt-6"
                >
                  Apply Coupon
                </button>
              </div>
            ) : (
              <p className="text-primary-800">✗ {validationResult.error || 'Invalid coupon'}</p>
            )}
          </div>
        )}

        {/* Available Coupons */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-primary-900 tracking-tight border-b border-primary-200 pb-4">Available Coupons</h3>
          <div className="space-y-2">
            {activeCoupons.length > 0 ? (
              activeCoupons.map((coupon) => (
                <div
                  key={coupon._id}
                  className="flex justify-between items-center py-4 border-b border-primary-100 hover:opacity-70 transition-opacity"
                >
                  <div>
                    <span className="font-mono font-semibold text-primary-900">{coupon.code}</span>
                    <span className="text-primary-600 ml-4 text-sm">{coupon.description}</span>
                  </div>
                  <button
                    onClick={() => {
                      setCouponCode(coupon.code);
                      if (orderAmount) {
                        handleValidateCoupon();
                      }
                    }}
                    className="text-primary-700 text-sm font-medium hover:text-primary-900 transition-colors"
                  >
                    Use
                  </button>
                </div>
              ))
            ) : (
              <p className="text-primary-500 py-8">No active coupons available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;


