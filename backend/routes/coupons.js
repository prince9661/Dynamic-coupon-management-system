/**
 * ============================================
 * UNIT II - Express: Coupon Routes
 * ============================================
 * 
 * Coupon API:
 * - CRUD operations for coupons
 * - Coupon validation and usage checking
 * - Demonstrates: All HTTP methods, MongoDB operations
 */

import express from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validateCoupon, validateObjectId, validateCouponUsage } from '../middleware/validation.js';
import * as couponController from '../controllers/couponController.js';

const router = express.Router();

/**
 * GET /api/coupons
 * Get all coupons with filtering
 * Demonstrates: GET method, query parameters, MongoDB queries
 */
router.get('/', couponController.getCoupons);

/**
 * GET /api/coupons/active
 * Get all active and valid coupons
 * Demonstrates: Static methods, custom queries
 */
router.get('/active', couponController.getActiveCoupons);

/**
 * GET /api/coupons/:id
 * Get single coupon by ID
 */
router.get('/:id', validateObjectId, couponController.getCouponById);

/**
 * GET /api/coupons/code/:code
 * Get coupon by code
 * Demonstrates: Static method usage
 */
router.get('/code/:code', couponController.getCouponByCode);

/**
 * POST /api/coupons
 * Create new coupon
 * Demonstrates: POST method, MongoDB create, validation
 */
router.post('/', requireAdmin, validateCoupon, couponController.createCoupon);

/**
 * PUT /api/coupons/:id
 * Update coupon
 * Demonstrates: PUT method, MongoDB update
 */
router.put('/:id', requireAdmin, validateObjectId, couponController.updateCoupon);

/**
 * PATCH /api/coupons/:id/activate
 * Activate coupon
 */
router.patch('/:id/activate', requireAdmin, validateObjectId, couponController.activateCoupon);

/**
 * PATCH /api/coupons/:id/deactivate
 * Deactivate coupon
 */
router.patch('/:id/deactivate', requireAdmin, validateObjectId, couponController.deactivateCoupon);

/**
 * DELETE /api/coupons/:id
 * Delete coupon
 * Demonstrates: DELETE method, MongoDB delete
 */
router.delete('/:id', requireAdmin, validateObjectId, couponController.deleteCoupon);

/**
 * POST /api/coupons/validate
 * Validate coupon without using it
 * Demonstrates: POST method, coupon validation logic
 */
router.post('/validate', validateCouponUsage, couponController.validateCoupon);

export default router;


