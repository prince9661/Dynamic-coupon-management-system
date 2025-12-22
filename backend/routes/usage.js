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
import { requireAuth } from '../middleware/auth.js';
import { validateCouponUsage } from '../middleware/validation.js';
import * as usageController from '../controllers/usageController.js';

const router = express.Router();

/**
 * POST /api/usage/apply
 * Apply coupon to an order
 * Demonstrates: POST method, transaction handling, real-time events
 */
router.post('/apply', requireAuth, validateCouponUsage, usageController.applyCoupon);

/**
 * GET /api/usage
 * Get usage statistics
 * Demonstrates: GET method, MongoDB aggregation
 */
router.get('/', requireAuth, usageController.getUsage);

/**
 * GET /api/usage/stats/:couponId
 * Get statistics for a specific coupon
 * Demonstrates: Static methods, aggregation
 */
router.get('/stats/:couponId', requireAuth, usageController.getUsageStats);

export default router;


