/**
 * ============================================
 * UNIT IV - MongoDB & Mongoose: Coupon Schema
 * ============================================
 * 
 * Coupon Model:
 * - Core entity for coupon management
 * - Demonstrates: Schema definition, validation, methods, statics
 * - Relationships: Belongs to Campaign
 */

import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    match: [/^[A-Z0-9]+$/, 'Coupon code must contain only uppercase letters and numbers'],
    minlength: [4, 'Coupon code must be at least 4 characters'],
    maxlength: [20, 'Coupon code cannot exceed 20 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: [true, 'Discount type is required'],
    default: 'percentage'
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value cannot be negative'],
    validate: {
      validator: function(value) {
        if (this.discountType === 'percentage') {
          return value <= 100;
        }
        return true;
      },
      message: 'Percentage discount cannot exceed 100%'
    }
  },
  minPurchaseAmount: {
    type: Number,
    default: 0,
    min: [0, 'Minimum purchase amount cannot be negative']
  },
  maxDiscountAmount: {
    type: Number,
    default: null,
    min: [0, 'Maximum discount amount cannot be negative']
  },
  maxUsage: {
    type: Number,
    default: null,
    min: [1, 'Maximum usage must be at least 1']
  },
  currentUsage: {
    type: Number,
    default: 0,
    min: [0, 'Current usage cannot be negative']
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: [true, 'Campaign ID is required']
  },
  createdBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  collection: 'coupons'
});

// Indexes for better query performance
couponSchema.index({ code: 1 });
couponSchema.index({ campaignId: 1, isActive: 1 });
couponSchema.index({ expiryDate: 1 });
couponSchema.index({ isActive: 1, expiryDate: 1 });

// Virtual for checking if coupon is valid
couponSchema.virtual('isValid').get(function() {
  const now = new Date();
  const isNotExpired = now <= this.expiryDate;
  const isStarted = now >= this.startDate;
  const hasUsageLeft = !this.maxUsage || this.currentUsage < this.maxUsage;
  
  return this.isActive && isNotExpired && isStarted && hasUsageLeft;
});

// Method to calculate discount amount
couponSchema.methods.calculateDiscount = function(amount) {
  if (amount < this.minPurchaseAmount) {
    return 0;
  }

  let discount = 0;
  
  if (this.discountType === 'percentage') {
    discount = (amount * this.discountValue) / 100;
    if (this.maxDiscountAmount) {
      discount = Math.min(discount, this.maxDiscountAmount);
    }
  } else {
    discount = Math.min(this.discountValue, amount);
  }

  return Math.round(discount * 100) / 100; // Round to 2 decimal places
};

// Method to check if coupon can be used
couponSchema.methods.canBeUsed = function(amount) {
  if (!this.isValid) {
    return { canUse: false, reason: 'Coupon is not valid' };
  }
  
  if (amount < this.minPurchaseAmount) {
    return { 
      canUse: false, 
      reason: `Minimum purchase amount of ${this.minPurchaseAmount} required` 
    };
  }

  if (this.maxUsage && this.currentUsage >= this.maxUsage) {
    return { canUse: false, reason: 'Coupon usage limit reached' };
  }

  return { canUse: true };
};

// Static method to find active coupons
couponSchema.statics.findActive = function() {
  const now = new Date();
  return this.find({
    isActive: true,
    startDate: { $lte: now },
    expiryDate: { $gte: now },
    $or: [
      { maxUsage: null },
      { $expr: { $lt: ['$currentUsage', '$maxUsage'] } }
    ]
  });
};

// Static method to find coupon by code
couponSchema.statics.findByCode = function(code) {
  return this.findOne({ code: code.toUpperCase() });
};

// Pre-save hook to validate dates
couponSchema.pre('save', function(next) {
  if (this.startDate >= this.expiryDate) {
    next(new Error('Expiry date must be after start date'));
  } else {
    next();
  }
});

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;


