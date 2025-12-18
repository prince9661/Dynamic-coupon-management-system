/**
 * ============================================
 * UNIT II - Express: Usage Tracking Routes
 * ============================================
 * 
 * Usage Tracking API:
 * - Track coupon usage
 * - Get usage statistics
 * - Demonstrates: POST, GET methods, MongoDB operations
 */

import express from 'express';
import Coupon from '../models/Coupon.js';
import UsageTracking from '../models/UsageTracking.js';
import Order from '../models/Order.js';
import { requireAuth } from '../middleware/auth.js';
import { validateCouponUsage } from '../middleware/validation.js';

const router = express.Router();

/**
 * POST /api/usage/apply
 * Apply coupon to an order
 * Demonstrates: POST method, transaction handling, real-time events
 */
router.post('/apply', requireAuth, validateCouponUsage, async (req, res) => {
  try {
    const { couponCode, amount, orderId } = req.body;
    const userId = req.userId;

    // Find coupon
    const coupon = await Coupon.findByCode(couponCode);
    
    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    // Validate coupon can be used
    const validation = coupon.canBeUsed(parseFloat(amount));
    if (!validation.canUse) {
      return res.status(400).json({ 
        error: validation.reason,
        coupon: {
          code: coupon.code,
          description: coupon.description
        }
      });
    }

    // Check if user has already used this coupon (if single-use)
    // This is a business rule - you might want to allow multiple uses
    // For now, we'll allow multiple uses per user

    // Calculate discount
    const originalAmount = parseFloat(amount);
    const discountAmount = coupon.calculateDiscount(originalAmount);
    const finalAmount = originalAmount - discountAmount;

    // Update coupon usage count
    coupon.currentUsage += 1;
    await coupon.save();

    // Create or update order in MongoDB (UNIT IV - MongoDB CREATE/UPDATE)
    let order;
    if (orderId) {
      // Update existing order
      order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      order.couponCode = couponCode;
      order.discountAmount = discountAmount;
      order.finalAmount = finalAmount;
      await order.save();
    } else {
      // Create new order
      order = new Order({
        userId: userId,
        couponCode: couponCode,
        totalAmount: originalAmount,
        discountAmount: discountAmount,
        finalAmount: finalAmount
      });
      await order.save();
    }

    // Create usage tracking record (UNIT IV - MongoDB CREATE)
    const usageTracking = new UsageTracking({
      couponId: coupon._id,
      couponCode: coupon.code,
      userId: userId,
      orderId: order._id.toString(),
      originalAmount,
      discountAmount,
      finalAmount
    });
    await usageTracking.save();

    // Emit event for real-time updates (UNIT I - EventEmitter)
    // This will be handled by Socket.IO handler
    const { couponEventEmitter } = await import('../utils/eventEmitterInstance.js');
    if (couponEventEmitter) {
      couponEventEmitter.emitCouponUsed({
        couponCode: coupon.code,
        couponId: coupon._id.toString(),
        userId,
        orderId: order._id.toString(),
        discountAmount,
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      message: 'Coupon applied successfully',
      usage: {
        couponCode: coupon.code,
        originalAmount,
        discountAmount,
        finalAmount,
        usageCount: coupon.currentUsage,
        maxUsage: coupon.maxUsage,
        orderId: order._id.toString()
      }
    });
  } catch (error) {
    console.error('Apply coupon error:', error);
    res.status(500).json({ error: 'Failed to apply coupon', message: error.message });
  }
});

/**
 * GET /api/usage
 * Get usage statistics
 * Demonstrates: GET method, MongoDB aggregation
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const { couponId, userId, page = 1, limit = 20 } = req.query;
    const query = {};

    if (couponId) query.couponId = couponId;
    if (userId) query.userId = userId;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // MongoDB query (UNIT IV - CRUD: READ)
    const usageRecords = await UsageTracking.find(query)
      .populate('couponId', 'code description discountType discountValue')
      .sort({ usedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await UsageTracking.countDocuments(query);

    res.json({
      usage: usageRecords,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get usage error:', error);
    res.status(500).json({ error: 'Failed to fetch usage records', message: error.message });
  }
});

/**
 * GET /api/usage/stats/:couponId
 * Get statistics for a specific coupon
 * Demonstrates: Static methods, aggregation
 */
router.get('/stats/:couponId', requireAuth, async (req, res) => {
  try {
    const stats = await UsageTracking.getCouponStats(req.params.couponId);
    
    const coupon = await Coupon.findById(req.params.couponId)
      .select('code description currentUsage maxUsage')
      .lean();

    res.json({
      coupon,
      statistics: stats
    });
  } catch (error) {
    console.error('Get usage stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics', message: error.message });
  }
});

export default router;

