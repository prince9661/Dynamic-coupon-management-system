import express from 'express';
import { createOrder, applyCouponToOrder, getOrders, updateOrderStatus } from '../controllers/orderController.js';
import { protect, limitTo } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

/**
 * Route: POST /api/orders
 * Description: Create a new pending order
 */
router.post('/', createOrder);

/**
 * Route: POST /api/orders/apply-coupon
 * Description: Apply a coupon to a pending order
 */
router.post('/apply-coupon', applyCouponToOrder);

/**
 * Route: GET /api/orders
 * Description: Get order history
 */
router.get('/', getOrders);

/**
 * Route: PUT /api/orders/:id/status
 * Description: Update order status (accept/reject/complete)
 * Access: Admin only
 */
router.put('/:id/status', limitTo('admin'), updateOrderStatus);

export default router;
