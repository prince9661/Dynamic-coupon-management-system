import express from 'express';
import {
    createCoupon,
    getCoupons,
    getCouponById,
    updateCoupon,
    deleteCoupon,
    validateCoupon,
    getActiveCoupons
} from '../controllers/couponController.js';
import { protect, limitTo } from '../middleware/auth.js';
import { couponValidation, validateCouponRules } from '../middleware/validation.js';

const router = express.Router();

// Apply authentication middleware to all routes in this file
router.use(protect);

/**
 * Route: GET /api/coupons/active
 * Description: Get a list of currently active coupons for users
 * Access: Private (All authenticated users)
 */
router.get('/active', getActiveCoupons);

/**
 * Route: POST /api/coupons/validate
 * Description: Check if a coupon code is valid for a purchase
 * Access: Private (All authenticated users)
 */
router.post('/validate', validateCouponRules, validateCoupon);

/**
 * Route: GET /api/coupons
 * Description: Get all coupons (with filters)
 * Access: Private (All authenticated users)
 */
router.get('/', getCoupons);

/**
 * Route: GET /api/coupons/:id
 * Description: Get details of a single coupon
 * Access: Private (All authenticated users)
 */
router.get('/:id', getCouponById);

// Admin Only Routes below

/**
 * Route: POST /api/coupons
 * Description: Create a new coupon
 * Access: Private (Admin only)
 */
router.post('/', limitTo('admin'), couponValidation, createCoupon);

/**
 * Route: PUT /api/coupons/:id
 * Description: Update an existing coupon
 * Access: Private (Admin only)
 */
router.put('/:id', limitTo('admin'), updateCoupon);

/**
 * Route: DELETE /api/coupons/:id
 * Description: Delete a coupon
 * Access: Private (Admin only)
 */
router.delete('/:id', limitTo('admin'), deleteCoupon);

export default router;
