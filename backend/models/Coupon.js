import mongoose from 'mongoose';

/**
 * Coupon Schema
 * 
 * Represents a discount coupon that can be applied to orders.
 * Includes configuration for discount type, validation rules (dates, limits),
 * and tracking of current usage.
 */
const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    minlength: 4
  },
  description: {
    type: String
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function (value) {
        // Enforce percentage max limit of 100
        if (this.discountType === 'percentage' && value > 100) {
          return false;
        }
        return true;
      },
      message: 'Percentage discount cannot exceed 100'
    }
  },
  minPurchaseAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  maxDiscountAmount: {
    type: Number,
    min: 0,
    // Only relevant for percentage discounts to cap the total deduction
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: true
  },
  // Usage Limits
  maxUsage: {
    type: Number,
    default: null // null means unlimited
  },
  userMaxUsage: {
    type: Number,
    default: 1 // Max times a single user can use this coupon
  },
  currentUsage: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});


// Create index for finding active coupons within a date range
couponSchema.index({ isActive: 1, expiryDate: 1, startDate: 1 });

/**
 * Method to check if the coupon is valid for a given amount and date.
 * Does NOT check user-specific limits (handled separately or via another method).
 * 
 * @param {number} purchaseAmount - The total amount of the order.
 * @returns {object} - Object containing `valid` (boolean) and optional `reason`.
 */
couponSchema.methods.isValid = function (purchaseAmount) {
  const now = new Date();

  if (!this.isActive) {
    return { valid: false, reason: 'Coupon is inactive' };
  }

  if (now < this.startDate) {
    return { valid: false, reason: 'Coupon is not yet active' };
  }

  if (now > this.expiryDate) {
    return { valid: false, reason: 'Coupon has expired' };
  }

  if (this.maxUsage !== null && this.currentUsage >= this.maxUsage) {
    return { valid: false, reason: 'Coupon usage limit reached' };
  }

  if (purchaseAmount < this.minPurchaseAmount) {
    return { valid: false, reason: `Minimum purchase amount of ${this.minPurchaseAmount} required` };
  }

  return { valid: true };
};

/**
 * Calculate the discount amount based on the coupon logic.
 * 
 * @param {number} purchaseAmount - The total order amount.
 * @returns {number} - The calculated discount amount.
 */
couponSchema.methods.calculateDiscount = function (purchaseAmount) {
  let discount = 0;

  if (this.discountType === 'percentage') {
    discount = (purchaseAmount * this.discountValue) / 100;
    // Apply max discount cap if set
    if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
      discount = this.maxDiscountAmount;
    }
  } else {
    // Fixed amount discount
    discount = this.discountValue;
  }

  // Ensure discount doesn't exceed purchase amount (no negative total)
  return Math.min(discount, purchaseAmount);
};

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
