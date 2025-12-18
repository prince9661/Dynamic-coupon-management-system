/**
 * ============================================
 * UNIT II - Express: Routing
 * ============================================
 * 
 * API Routes:
 * - Demonstrates: express.Router, RESTful API design
 * - GET, POST, PUT, DELETE methods
 * - Route organization and modularity
 */

import express from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import couponRoutes from './coupons.js';
import campaignRoutes from './campaigns.js';
import usageRoutes from './usage.js';
import authRoutes from './auth.js';
import orderRoutes from './orders.js';

const router = express.Router();

// Health check route (no authentication required)
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    message: 'API is operational',
    timestamp: new Date().toISOString()
  });
});

// Mount route modules
router.use('/auth', authRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/coupons', couponRoutes);
router.use('/usage', usageRoutes);
router.use('/orders', orderRoutes);

export default router;


