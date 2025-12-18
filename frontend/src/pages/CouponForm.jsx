/**
 * ============================================
 * UNIT IV - Forms: Coupon Creation/Edit Form
 * ============================================
 * 
 * Coupon Form Page:
 * - Create or edit coupon
 * - Demonstrates: Controlled inputs, form validation, async operations
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createCoupon, updateCoupon, fetchCouponById, fetchActiveCoupons } from '../store/slices/couponSlice.js';
import { fetchCampaigns } from '../store/slices/campaignSlice.js';

/**
 * CouponForm Component
 * Demonstrates: useState, useEffect, controlled inputs, form validation
 */
const CouponForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const { currentCoupon } = useSelector((state) => state.coupons);
  const { campaigns } = useSelector((state) => state.campaigns);

  // Form state (UNIT III - useState)
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minPurchaseAmount: '',
    maxDiscountAmount: '',
    maxUsage: '',
    expiryDate: '',
    startDate: '',
    campaignId: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch coupon if editing (UNIT III - useEffect)
  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchCouponById(id));
    }
    dispatch(fetchCampaigns());
  }, [dispatch, id, isEditMode]);

  // Populate form when coupon is loaded
  useEffect(() => {
    if (isEditMode && currentCoupon) {
      setFormData({
        code: currentCoupon.code || '',
        description: currentCoupon.description || '',
        discountType: currentCoupon.discountType || 'percentage',
        discountValue: currentCoupon.discountValue || '',
        minPurchaseAmount: currentCoupon.minPurchaseAmount || '',
        maxDiscountAmount: currentCoupon.maxDiscountAmount || '',
        maxUsage: currentCoupon.maxUsage || '',
        expiryDate: currentCoupon.expiryDate ? new Date(currentCoupon.expiryDate).toISOString().split('T')[0] : '',
        startDate: currentCoupon.startDate ? new Date(currentCoupon.startDate).toISOString().split('T')[0] : '',
        campaignId: currentCoupon.campaignId?._id || currentCoupon.campaignId || '',
      });
    }
  }, [currentCoupon, isEditMode]);

  /**
   * Handle input change
   * Demonstrates: Controlled input pattern
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  /**
   * Validate form
   * Demonstrates: Form validation logic
   */
  const validate = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Coupon code is required';
    } else if (formData.code.length < 4) {
      newErrors.code = 'Coupon code must be at least 4 characters';
    }

    if (!formData.discountValue || parseFloat(formData.discountValue) <= 0) {
      newErrors.discountValue = 'Discount value must be greater than 0';
    }

    if (formData.discountType === 'percentage' && parseFloat(formData.discountValue) > 100) {
      newErrors.discountValue = 'Percentage discount cannot exceed 100%';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    }

    if (!formData.campaignId) {
      newErrors.campaignId = 'Campaign is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   * Demonstrates: Form submission, async actions
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        minPurchaseAmount: formData.minPurchaseAmount ? parseFloat(formData.minPurchaseAmount) : 0,
        maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : null,
        maxUsage: formData.maxUsage ? parseInt(formData.maxUsage) : null,
      };

      if (isEditMode) {
        await dispatch(updateCoupon({ id, data: submitData }));
      } else {
        await dispatch(createCoupon(submitData));
      }

      navigate('/coupons');
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-5xl font-bold text-primary-900 tracking-tight mb-16 border-b border-primary-200 pb-4">
        {isEditMode ? 'Edit Coupon' : 'Create New Coupon'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Coupon Code */}
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-primary-900 mb-3 tracking-tight">
            Coupon Code *
          </label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            disabled={isEditMode}
            className={`w-full px-0 py-3 border-0 border-b bg-transparent focus:outline-none text-primary-900 placeholder-primary-400 text-base ${
              errors.code ? 'border-primary-500' : 'border-primary-300 focus:border-primary-900'
            } disabled:opacity-50`}
            placeholder="e.g., SAVE20"
          />
          {errors.code && <p className="text-primary-600 text-sm mt-2">{errors.code}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-primary-900 mb-3 tracking-tight">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-0 py-3 border-0 border-b border-primary-300 bg-transparent focus:outline-none focus:border-primary-900 text-primary-900 placeholder-primary-400 text-base resize-none"
            placeholder="Coupon description"
          />
        </div>

        {/* Discount Type */}
        <div>
          <label htmlFor="discountType" className="block text-sm font-medium text-primary-900 mb-3 tracking-tight">
            Discount Type *
          </label>
          <select
            id="discountType"
            name="discountType"
            value={formData.discountType}
            onChange={handleChange}
            className="w-full px-0 py-3 border-0 border-b border-primary-300 bg-transparent focus:outline-none focus:border-primary-900 text-primary-900 text-base"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>

        {/* Discount Value */}
        <div>
          <label htmlFor="discountValue" className="block text-sm font-medium text-primary-900 mb-3 tracking-tight">
            Discount Value *
          </label>
          <input
            type="number"
            id="discountValue"
            name="discountValue"
            value={formData.discountValue}
            onChange={handleChange}
            min="0"
            step={formData.discountType === 'percentage' ? '1' : '0.01'}
            className={`w-full px-0 py-3 border-0 border-b bg-transparent focus:outline-none text-primary-900 placeholder-primary-400 text-base ${
              errors.discountValue ? 'border-primary-500' : 'border-primary-300 focus:border-primary-900'
            }`}
          />
          {errors.discountValue && <p className="text-primary-600 text-sm mt-2">{errors.discountValue}</p>}
        </div>

        {/* Min Purchase Amount */}
        <div>
          <label htmlFor="minPurchaseAmount" className="block text-sm font-medium text-primary-900 mb-3 tracking-tight">
            Minimum Purchase Amount
          </label>
          <input
            type="number"
            id="minPurchaseAmount"
            name="minPurchaseAmount"
            value={formData.minPurchaseAmount}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-0 py-3 border-0 border-b border-primary-300 bg-transparent focus:outline-none focus:border-primary-900 text-primary-900 placeholder-primary-400 text-base"
          />
        </div>

        {/* Max Discount Amount */}
        <div>
          <label htmlFor="maxDiscountAmount" className="block text-sm font-medium text-primary-900 mb-3 tracking-tight">
            Maximum Discount Amount
          </label>
          <input
            type="number"
            id="maxDiscountAmount"
            name="maxDiscountAmount"
            value={formData.maxDiscountAmount}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-0 py-3 border-0 border-b border-primary-300 bg-transparent focus:outline-none focus:border-primary-900 text-primary-900 placeholder-primary-400 text-base"
          />
        </div>

        {/* Max Usage */}
        <div>
          <label htmlFor="maxUsage" className="block text-sm font-medium text-primary-900 mb-3 tracking-tight">
            Maximum Usage (leave empty for unlimited)
          </label>
          <input
            type="number"
            id="maxUsage"
            name="maxUsage"
            value={formData.maxUsage}
            onChange={handleChange}
            min="1"
            className="w-full px-0 py-3 border-0 border-b border-primary-300 bg-transparent focus:outline-none focus:border-primary-900 text-primary-900 placeholder-primary-400 text-base"
          />
        </div>

        {/* Campaign */}
        <div>
          <label htmlFor="campaignId" className="block text-sm font-medium text-primary-900 mb-3 tracking-tight">
            Campaign *
          </label>
          <select
            id="campaignId"
            name="campaignId"
            value={formData.campaignId}
            onChange={handleChange}
            className={`w-full px-0 py-3 border-0 border-b bg-transparent focus:outline-none text-primary-900 text-base ${
              errors.campaignId ? 'border-primary-500' : 'border-primary-300 focus:border-primary-900'
            }`}
          >
            <option value="">Select a campaign</option>
            {campaigns.map((campaign) => (
              <option key={campaign._id} value={campaign._id}>
                {campaign.name}
              </option>
            ))}
          </select>
          {errors.campaignId && <p className="text-primary-600 text-sm mt-2">{errors.campaignId}</p>}
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-primary-900 mb-3 tracking-tight">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full px-0 py-3 border-0 border-b border-primary-300 bg-transparent focus:outline-none focus:border-primary-900 text-primary-900 text-base"
          />
        </div>

        {/* Expiry Date */}
        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium text-primary-900 mb-3 tracking-tight">
            Expiry Date *
          </label>
          <input
            type="date"
            id="expiryDate"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className={`w-full px-0 py-3 border-0 border-b bg-transparent focus:outline-none text-primary-900 text-base ${
              errors.expiryDate ? 'border-primary-500' : 'border-primary-300 focus:border-primary-900'
            }`}
          />
          {errors.expiryDate && <p className="text-primary-600 text-sm mt-2">{errors.expiryDate}</p>}
        </div>

        {/* Submit Button */}
        <div className="flex space-x-4 pt-8 border-t border-primary-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary-900 text-white px-8 py-3 text-sm font-medium hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Saving...' : isEditMode ? 'Update Coupon' : 'Create Coupon'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/coupons')}
            className="text-primary-700 px-8 py-3 text-sm font-medium hover:text-primary-900 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CouponForm;


