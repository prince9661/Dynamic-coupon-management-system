import mongoose from 'mongoose';

/**
 * UsageTracking Schema
 * 
 * Logs individual coupon usages by users.
 * Used to enforce 'per-user' usage limits (e.g., "One use per customer").
 */
const usageTrackingSchema = new mongoose.Schema({
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  usedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Composite index to efficiently count usage per user per coupon
usageTrackingSchema.index({ couponId: 1, userId: 1 });

const UsageTracking = mongoose.model('UsageTracking', usageTrackingSchema);
export default UsageTracking;
