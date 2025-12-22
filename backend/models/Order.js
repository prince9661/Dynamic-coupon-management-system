/**
 * ============================================
 * UNIT IV - MongoDB & Mongoose: Order Schema
 * ============================================
 * 
 * Order Model:
 * - Stores order information
 * - Demonstrates: Schema definition, relationships, validation
 */

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  couponCode: {
    type: String,
    default: null,
    index: true
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: [0, 'Discount amount cannot be negative']
  },
  finalAmount: {
    type: Number,
    required: [true, 'Final amount is required'],
    min: [0, 'Final amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true,
  collection: 'orders'
});

// Indexes for better query performance
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ couponCode: 1 });
orderSchema.index({ status: 1 });

// Virtual for formatted date
orderSchema.virtual('formattedDate').get(function () {
  return this.createdAt.toLocaleString();
});

// Static method to find orders by user
orderSchema.statics.findByUser = function (userId, options = {}) {
  const { page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;

  return this.find({ userId })
    .populate('userId', 'username email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

// Static method to find all orders (for admin)
orderSchema.statics.findAll = function (options = {}) {
  const { page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;

  return this.find()
    .populate('userId', 'username email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

const Order = mongoose.model('Order', orderSchema);

export default Order;


