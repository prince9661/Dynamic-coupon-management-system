/**
 * ============================================
 * UNIT IV - MongoDB: Order Routes
 * ============================================
 * 
 * Order API:
 * - CRUD operations for orders
 * - Demonstrates: MongoDB operations, Mongoose queries
 */

import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as orderController from '../controllers/orderController.js';

const router = express.Router();

/**
 * GET /api/orders
 * Get all orders for current user (or all if admin)
 * Demonstrates: GET method, MongoDB queries
 */
router.get('/', requireAuth, orderController.getOrders);

/**
 * GET /api/orders/:id
 * Get single order by ID
 */
router.get('/:id', requireAuth, orderController.getOrderById);

/**
 * POST /api/orders
 * Create new order
 * Demonstrates: POST method, MongoDB CREATE
 */
router.post('/', requireAuth, orderController.createOrder);

/**
 * PUT /api/orders/:id
 * Update order
 * Demonstrates: PUT method, MongoDB UPDATE
 */
router.put('/:id', requireAuth, orderController.updateOrder);

export default router;


