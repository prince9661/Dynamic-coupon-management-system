import mongoose from 'mongoose';

/**
 * Campaign Schema
 * 
 * Groups coupons under a marketing campaign.
 * Allows managing the lifecycle of multiple coupons (e.g., Summer Sale).
 */
const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

/**
 * Pre-validate middleware to ensure logical date ranges.
 */
campaignSchema.pre('validate', function (next) {
  if (this.startDate && this.endDate && this.startDate > this.endDate) {
    this.invalidate('endDate', 'End date must be after start date');
  }
  next();
});

const Campaign = mongoose.model('Campaign', campaignSchema);
export default Campaign;
