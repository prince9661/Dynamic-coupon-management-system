import express from 'express';
import { getCouponUsage, getUserUsage, getUsageStats } from '../controllers/usageController.js';
import { protect, limitTo } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(limitTo('admin')); // All usage routes are admin only

/**
 * Route: GET /api/usage/stats
 * Description: Get aggregated system stats
 */
router.get('/stats', getUsageStats);

/**
 * Route: GET /api/usage/coupon/:couponId
 * Description: Get usage history for a specific coupon
 */
router.get('/coupon/:couponId', getCouponUsage);

/**
 * Route: GET /api/usage/user/:userId
 * Description: Get usage history for a specific user
 */
router.get('/user/:userId', getUserUsage);

export default router;
