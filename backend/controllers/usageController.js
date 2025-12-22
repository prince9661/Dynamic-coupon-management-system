
import Coupon from '../models/Coupon.js';
import UsageTracking from '../models/UsageTracking.js';
import Order from '../models/Order.js';

/**
 * Apply coupon to an order
 * Uses atomic updates to prevent race conditions
 */
export const applyCoupon = async (req, res) => {
    try {
        const { couponCode, amount, orderId } = req.body;
        const userId = req.userId;

        // Find coupon first to validate basic rules
        const coupon = await Coupon.findByCode(couponCode);

        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        // Validate coupon can be used (expiry, min purchase, etc.)
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

        // ATOMIC UPDATE: Increment usage count only if it hasn't reached maxUsage
        // This prevents race conditions where multiple requests could exceed the limit
        const updatedCoupon = await Coupon.findOneAndUpdate(
            {
                _id: coupon._id,
                $or: [
                    { maxUsage: null },           // No limit
                    { $expr: { $lt: ["$currentUsage", "$maxUsage"] } } // Current usage < Max usage
                ]
            },
            { $inc: { currentUsage: 1 } },
            { new: true }
        );

        if (!updatedCoupon) {
            return res.status(400).json({ error: 'Coupon usage limit reached' });
        }

        // Calculate discount
        const originalAmount = parseFloat(amount);
        const discountAmount = updatedCoupon.calculateDiscount(originalAmount);
        const finalAmount = originalAmount - discountAmount;

        // Create or update order in MongoDB (UNIT IV - MongoDB CREATE/UPDATE)
        let order;
        if (orderId) {
            // Update existing order
            order = await Order.findById(orderId);
            if (!order) {
                // Rollback coupon usage if order not found (manual compensation)
                await Coupon.findByIdAndUpdate(coupon._id, { $inc: { currentUsage: -1 } });
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
            couponId: updatedCoupon._id,
            couponCode: updatedCoupon.code,
            userId: userId,
            orderId: order._id.toString(),
            originalAmount,
            discountAmount,
            finalAmount
        });
        await usageTracking.save();

        // Emit event for real-time updates (UNIT I - EventEmitter)
        const { couponEventEmitter } = await import('../utils/eventEmitterInstance.js');
        if (couponEventEmitter) {
            couponEventEmitter.emitCouponUsed({
                couponCode: updatedCoupon.code,
                couponId: updatedCoupon._id.toString(),
                userId,
                orderId: order._id.toString(),
                discountAmount,
                timestamp: new Date().toISOString()
            });
        }

        res.json({
            message: 'Coupon applied successfully',
            usage: {
                couponCode: updatedCoupon.code,
                originalAmount,
                discountAmount,
                finalAmount,
                usageCount: updatedCoupon.currentUsage,
                maxUsage: updatedCoupon.maxUsage,
                orderId: order._id.toString()
            }
        });
    } catch (error) {
        console.error('Apply coupon error:', error);
        res.status(500).json({ error: 'Failed to apply coupon', message: error.message });
    }
};

/**
 * Get usage statistics
 */
export const getUsage = async (req, res) => {
    try {
        const { couponId, userId, page = 1, limit = 20 } = req.query;
        const query = {};

        if (couponId) query.couponId = couponId;
        if (userId) query.userId = userId;

        const skip = (parseInt(page) - 1) * parseInt(limit);

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
};

/**
 * Get statistics for a specific coupon
 */
export const getUsageStats = async (req, res) => {
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
};
