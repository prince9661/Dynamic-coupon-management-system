import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createCoupon, updateCoupon, fetchCouponById } from '../store/slices/couponSlice.js';
import { fetchCampaigns } from '../store/slices/campaignSlice.js';

/**
 * CouponForm Component
 * 
 * Handles both Creation and Editing of coupons.
 * Uses 'id' param to determine mode (Create vs Edit).
 * Includes client-side validation logic.
 */
const CouponForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // If ID exists, we are in Edit mode
  const isEditMode = !!id;

  const { currentCoupon } = useSelector((state) => state.coupons);
  const { campaigns } = useSelector((state) => state.campaigns);

  // Form State
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

  // Initialize Data
  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchCouponById(id));
    }
    // Fetch campaigns for the dropdown
    dispatch(fetchCampaigns());
  }, [dispatch, id, isEditMode]);

  // Populate form when editing
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
        // Format dates for input[type="date"]
        expiryDate: currentCoupon.expiryDate ? new Date(currentCoupon.expiryDate).toISOString().split('T')[0] : '',
        startDate: currentCoupon.startDate ? new Date(currentCoupon.startDate).toISOString().split('T')[0] : '',
        // Handle populated campaign object or direct ID
        campaignId: currentCoupon.campaignId?._id || currentCoupon.campaignId || '',
      });
    }
  }, [currentCoupon, isEditMode]);

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
   * Client-side validation logic.
   * Ensures data integrity before sending to API.
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare payload (convert strings to numbers)
      const submitData = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        minPurchaseAmount: formData.minPurchaseAmount ? parseFloat(formData.minPurchaseAmount) : 0,
        maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : null,
        maxUsage: formData.maxUsage ? parseInt(formData.maxUsage) : null,
      };

      // Cleanup optional fields
      if (!submitData.startDate) delete submitData.startDate;
      if (!submitData.maxUsage) submitData.maxUsage = null;

      // Remove empty strings keys
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '') {
          delete submitData[key];
        }
      });

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
    <div className="max-w-2xl mx-auto pt-8">
      <div className="bg-[#010409] border border-[#30363d] rounded-[12px] p-8 shadow-2xl animate-float">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-8 border-b border-[#30363d] pb-4">
          {isEditMode ? 'Edit Coupon' : 'Create New Coupon'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Coupon Code */}
          <div>
            <label htmlFor="code" className="block text-sm font-semibold text-white mb-2">
              Coupon Code <span className="text-[#ff7b72]">*</span>
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              disabled={isEditMode}
              className={`w-full bg-[#0d1117] border border-[#30363d] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30 transition-all shadow-sm placeholder-[#484f58] ${errors.code ? 'border-[#ff7b72] focus:border-[#ff7b72] focus:ring-[#ff7b72]/30' : ''
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              placeholder="e.g., SAVE20"
            />
            {errors.code && <p className="text-[#ff7b72] text-xs mt-1">{errors.code}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-white mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30 transition-all shadow-sm placeholder-[#484f58] resize-none"
              placeholder="Coupon description"
            />
          </div>

          {/* Discount Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="discountType" className="block text-sm font-semibold text-white mb-2">
                Discount Type <span className="text-[#ff7b72]">*</span>
              </label>
              <select
                id="discountType"
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30 transition-all shadow-sm"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>

            <div>
              <label htmlFor="discountValue" className="block text-sm font-semibold text-white mb-2">
                Discount Value <span className="text-[#ff7b72]">*</span>
              </label>
              <input
                type="number"
                id="discountValue"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleChange}
                min="0"
                step={formData.discountType === 'percentage' ? '1' : '0.01'}
                className={`w-full bg-[#0d1117] border border-[#30363d] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30 transition-all shadow-sm placeholder-[#484f58] ${errors.discountValue ? 'border-[#ff7b72] focus:border-[#ff7b72] focus:ring-[#ff7b72]/30' : ''
                  }`}
              />
              {errors.discountValue && <p className="text-[#ff7b72] text-xs mt-1">{errors.discountValue}</p>}
            </div>
          </div>

          {/* Value Constraints */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="minPurchaseAmount" className="block text-sm font-semibold text-white mb-2">
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
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30 transition-all shadow-sm placeholder-[#484f58]"
              />
            </div>

            <div>
              <label htmlFor="maxDiscountAmount" className="block text-sm font-semibold text-white mb-2">
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
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30 transition-all shadow-sm placeholder-[#484f58]"
              />
            </div>
          </div>

          {/* Usage and Campaign */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="maxUsage" className="block text-sm font-semibold text-white mb-2">
                Maximum Usage <span className="text-[#8b949e] font-normal">(optional)</span>
              </label>
              <input
                type="number"
                id="maxUsage"
                name="maxUsage"
                value={formData.maxUsage}
                onChange={handleChange}
                min="1"
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30 transition-all shadow-sm placeholder-[#484f58]"
                placeholder="Unlimited if empty"
              />
            </div>

            <div>
              <label htmlFor="campaignId" className="block text-sm font-semibold text-white mb-2">
                Campaign <span className="text-[#ff7b72]">*</span>
              </label>
              <select
                id="campaignId"
                name="campaignId"
                value={formData.campaignId}
                onChange={handleChange}
                className={`w-full bg-[#0d1117] border border-[#30363d] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30 transition-all shadow-sm ${errors.campaignId ? 'border-[#ff7b72] focus:border-[#ff7b72] focus:ring-[#ff7b72]/30' : ''
                  }`}
              >
                <option value="">Select a campaign</option>
                {campaigns.map((campaign) => (
                  <option key={campaign._id} value={campaign._id}>
                    {campaign.name}
                  </option>
                ))}
              </select>
              {errors.campaignId && <p className="text-[#ff7b72] text-xs mt-1">{errors.campaignId}</p>}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startDate" className="block text-sm font-semibold text-white mb-2">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30 transition-all shadow-sm text-opacity-90 is-dark-date"
              />
            </div>

            <div>
              <label htmlFor="expiryDate" className="block text-sm font-semibold text-white mb-2">
                Expiry Date <span className="text-[#ff7b72]">*</span>
              </label>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className={`w-full bg-[#0d1117] border border-[#30363d] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30 transition-all shadow-sm is-dark-date ${errors.expiryDate ? 'border-[#ff7b72] focus:border-[#ff7b72] focus:ring-[#ff7b72]/30' : ''
                  }`}
              />
              {errors.expiryDate && <p className="text-[#ff7b72] text-xs mt-1">{errors.expiryDate}</p>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6 border-t border-[#30363d]">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#238636] text-white px-6 py-2.5 rounded-[6px] text-sm font-bold hover:bg-[#2ea043] border border-[rgba(240,246,252,0.1)] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update Coupon' : 'Create Coupon'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/coupons')}
              className="text-[#c9d1d9] px-6 py-2.5 text-sm font-medium hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponForm;
