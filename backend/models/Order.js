import mongoose from 'mongoose';

/**
 * Order Schema
 * 
 * Represents a customer's purchase. 
 * Stores details about applied coupons, original price, and final price.
 */
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  finalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  couponCode: {
    type: String,
    // Optional, only present if a coupon was used
  },
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
