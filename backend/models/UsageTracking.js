/**
 * ============================================
 * UNIT IV - MongoDB & Mongoose: Usage Tracking Schema
 * ============================================
 * 
 * Usage Tracking Model:
 * - Tracks each coupon usage instance
 * - Demonstrates: Schema definition, relationships, timestamps
 * - Used for analytics and preventing duplicate usage
 */

import mongoose from 'mongoose';

const usageTrackingSchema = new mongoose.Schema({
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    required: [true, 'Coupon ID is required'],
    index: true
  },
  couponCode: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  orderId: {
    type: String, // MongoDB order ID as string
    required: [true, 'Order ID is required'],
    index: true
  },
  originalAmount: {
    type: Number,
    required: true,
    min: [0, 'Original amount cannot be negative']
  },
  discountAmount: {
    type: Number,
    required: true,
    min: [0, 'Discount amount cannot be negative']
  },
  finalAmount: {
    type: Number,
    required: true,
    min: [0, 'Final amount cannot be negative']
  },
  usedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true,
  collection: 'usage_tracking'
});

// Compound index for preventing duplicate usage per user
usageTrackingSchema.index({ couponId: 1, userId: 1 });

// Index for analytics queries
usageTrackingSchema.index({ usedAt: -1 });
usageTrackingSchema.index({ couponCode: 1, usedAt: -1 });

// Virtual for formatted date
usageTrackingSchema.virtual('formattedDate').get(function() {
  return this.usedAt.toLocaleString();
});

// Static method to get usage statistics for a coupon
usageTrackingSchema.statics.getCouponStats = async function(couponId) {
    const stats = await this.aggregate([
      { $match: { couponId: new mongoose.Types.ObjectId(couponId) } },
    {
      $group: {
        _id: null,
        totalUsage: { $sum: 1 },
        totalDiscount: { $sum: '$discountAmount' },
        totalRevenue: { $sum: '$finalAmount' },
        avgDiscount: { $avg: '$discountAmount' }
      }
    }
  ]);

  return stats[0] || {
    totalUsage: 0,
    totalDiscount: 0,
    totalRevenue: 0,
    avgDiscount: 0
  };
};

// Static method to check if user has used coupon
usageTrackingSchema.statics.hasUserUsedCoupon = async function(couponId, userId) {
  const usage = await this.findOne({ couponId, userId });
  return !!usage;
};

const UsageTracking = mongoose.model('UsageTracking', usageTrackingSchema);

export default UsageTracking;

