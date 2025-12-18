/**
 * ============================================
 * UNIT IV - MongoDB & Mongoose: Campaign Schema
 * ============================================
 * 
 * Campaign Model:
 * - Represents a marketing campaign that contains multiple coupons
 * - Demonstrates: Schema definition, validation, relationships
 */

import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Campaign name is required'],
    trim: true,
    maxlength: [100, 'Campaign name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    default: Date.now
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  collection: 'campaigns' // Explicit collection name
});

// Index for better query performance
campaignSchema.index({ isActive: 1, endDate: 1 });
campaignSchema.index({ startDate: 1, endDate: 1 });

// Virtual for checking if campaign is currently active
campaignSchema.virtual('isCurrentlyActive').get(function() {
  const now = new Date();
  return this.isActive && now >= this.startDate && now <= this.endDate;
});

// Method to get campaign statistics
campaignSchema.methods.getStats = async function() {
  const Coupon = mongoose.model('Coupon');
  const totalCoupons = await Coupon.countDocuments({ campaignId: this._id });
  const activeCoupons = await Coupon.countDocuments({ 
    campaignId: this._id, 
    isActive: true 
  });
  
  return {
    totalCoupons,
    activeCoupons,
    inactiveCoupons: totalCoupons - activeCoupons
  };
};

const Campaign = mongoose.model('Campaign', campaignSchema);

export default Campaign;


