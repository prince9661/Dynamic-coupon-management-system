import Coupon from '../models/Coupon.js';
import UsageTracking from '../models/UsageTracking.js';
import { validationResult } from 'express-validator';
import { io } from '../server.js';

/**
 * Create a new coupon.
 * 
 * @route POST /api/coupons
 * @access Private (Admin only)
 */
export const createCoupon = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const couponData = {
            ...req.body,
            createdBy: req.user._id
        };

        const coupon = new Coupon(couponData);
        const savedCoupon = await coupon.save();

        res.status(201).json(savedCoupon);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Coupon code already exists' });
        }
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get all coupons with various filters (active status, campaign).
 * 
 * @route GET /api/coupons
 * @access Private
 */
export const getCoupons = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build filter object dynamically based on query params
        const filter = {};
        if (req.query.isActive !== undefined) {
            filter.isActive = req.query.isActive === 'true';
        }
        if (req.query.campaignId) {
            filter.campaignId = req.query.campaignId;
        }

        const coupons = await Coupon.find(filter)
            .populate('campaignId', 'name') // Fetch campaign details
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Coupon.countDocuments(filter);

        res.json({
            coupons,
            page,
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get active coupons specifically for users (e.g., checkout page).
 * Only returns coupons that are currently valid.
 * 
 * @route GET /api/coupons/active
 * @access Private
 */
export const getActiveCoupons = async (req, res) => {
    try {
        const now = new Date();
        const coupons = await Coupon.find({
            isActive: true,
            startDate: { $lte: now }, // Started in the past or now
            expiryDate: { $gte: now }, // Expiring in the future
            $expr: {
                $or: [
                    { $eq: ["$maxUsage", null] }, // No max usage set
                    { $lt: ["$currentUsage", "$maxUsage"] } // Or usage is below limit
                ]
            }
        })
            .select('code description discountType discountValue minPurchaseAmount expiryDate') // Return only necessary fields
            .sort({ expiryDate: 1 }); // Show soonest expiring first

        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get single coupon details by ID.
 * 
 * @route GET /api/coupons/:id
 * @access Private
 */
export const getCouponById = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id).populate('campaignId');
        if (coupon) {
            res.json(coupon);
        } else {
            res.status(404).json({ message: 'Coupon not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Update an existing coupon.
 * 
 * @route PUT /api/coupons/:id
 * @access Private (Admin only)
 */
export const updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (coupon) {
            // Update logic handled by Mongoose based on passed body
            Object.assign(coupon, req.body);
            const updatedCoupon = await coupon.save();
            res.json(updatedCoupon);
        } else {
            res.status(404).json({ message: 'Coupon not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Delete a coupon.
 * 
 * @route DELETE /api/coupons/:id
 * @access Private (Admin only)
 */
export const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (coupon) {
            await coupon.deleteOne();
            res.json({ message: 'Coupon removed' });
        } else {
            res.status(404).json({ message: 'Coupon not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Validate a coupon code for a specific user and purchase amount.
 * 
 * @route POST /api/coupons/validate
 * @access Private
 */
export const validateCoupon = async (req, res) => {
    try {
        const { code, amount } = req.body;
        const userId = req.user._id;

        const coupon = await Coupon.findOne({ code });

        if (!coupon) {
            return res.status(404).json({ message: 'Invalid coupon code' });
        }

        // Step 1: Basic validity check (expiry, start date, global limit)
        const validity = coupon.isValid(amount);
        if (!validity.valid) {
            return res.status(400).json({ message: validity.reason });
        }

        // Step 2: Check per-user usage limit
        const userUsageCount = await UsageTracking.countDocuments({
            couponId: coupon._id,
            userId: userId
        });

        if (userUsageCount >= coupon.userMaxUsage) {
            return res.status(400).json({
                message: 'You have assumed the maximum usage limit for this coupon'
            });
        }

        // Step 3: Calculate potential discount
        const discountAmount = coupon.calculateDiscount(amount);

        res.json({
            valid: true,
            coupon: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue
            },
            calculation: {
                originalAmount: amount,
                discountAmount: discountAmount,
                finalAmount: amount - discountAmount
            }
        });

    } catch (error) {
        console.error('Validation Error:', error);
        res.status(500).json({ message: error.message });
    }
};
