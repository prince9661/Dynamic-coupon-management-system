import UsageTracking from '../models/UsageTracking.js';
import Coupon from '../models/Coupon.js';

/**
 * Get usage history for a specific coupon.
 * Useful for admins to see who used a particular coupon.
 * 
 * @route GET /api/usage/coupon/:couponId
 * @access Private (Admin only)
 */
export const getCouponUsage = async (req, res) => {
    try {
        const usage = await UsageTracking.find({ couponId: req.params.couponId })
            .populate('userId', 'username email')
            .populate('orderId', 'totalAmount finalAmount status')
            .sort({ usedAt: -1 });

        res.json(usage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get usage history for a specific user.
 * Useful for building user profiles or history logs.
 * 
 * @route GET /api/usage/user/:userId
 * @access Private (Admin only)
 */
export const getUserUsage = async (req, res) => {
    try {
        const usage = await UsageTracking.find({ userId: req.params.userId })
            .populate('couponId', 'code description discountType discountValue')
            .populate('orderId', 'totalAmount finalAmount status')
            .sort({ usedAt: -1 });

        res.json(usage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get aggregated analytics data for dashboard.
 * Returns total coupons, total usage instances, and recent activity.
 * 
 * @route GET /api/usage/stats
 * @access Private (Admin only)
 */
export const getUsageStats = async (req, res) => {
    try {
        const totalUsage = await UsageTracking.countDocuments();
        const uniqueUsers = await UsageTracking.distinct('userId');

        // Aggregation pipeline to find most popular coupons
        const topCoupons = await UsageTracking.aggregate([
            { $group: { _id: '$couponId', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'coupons',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'couponDetails'
                }
            },
            { $unwind: '$couponDetails' },
            {
                $project: {
                    code: '$couponDetails.code',
                    count: 1
                }
            }
        ]);

        res.json({
            totalUsage,
            uniqueUsersCount: uniqueUsers.length,
            topCoupons
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
