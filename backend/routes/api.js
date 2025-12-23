import express from 'express';
import authRoutes from './auth.js';
import couponRoutes from './coupons.js';
import campaignRoutes from './campaigns.js';
import orderRoutes from './orders.js';
import usageRoutes from './usage.js';

const router = express.Router();

// Mount Auth routes (Login, Register, Profile)
router.use('/auth', authRoutes);

// Mount Coupon routes (CRUD, Validate)
router.use('/coupons', couponRoutes);

// Mount Campaign routes (CRUD)
router.use('/campaigns', campaignRoutes);

// Mount Order routes (Create, Apply Coupon, History)
router.use('/orders', orderRoutes);

// Mount Usage Tracking routes (Stats, History)
router.use('/usage', usageRoutes);

export default router;
