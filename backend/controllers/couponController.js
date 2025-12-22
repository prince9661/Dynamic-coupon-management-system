
import Coupon from '../models/Coupon.js';
import Campaign from '../models/Campaign.js';

// Get all coupons with filtering
export const getCoupons = async (req, res) => {
    try {
        const {
            campaignId,
            isActive,
            code,
            page = 1,
            limit = 10
        } = req.query;

        const query = {};

        if (campaignId) query.campaignId = campaignId;
        if (isActive !== undefined && isActive !== '') query.isActive = isActive === 'true';
        if (code) query.code = code.toUpperCase();

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const coupons = await Coupon.find(query)
            .populate('campaignId', 'name description')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const total = await Coupon.countDocuments(query);

        res.json({
            coupons,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get coupons error:', error);
        res.status(500).json({ error: 'Failed to fetch coupons', message: error.message });
    }
};

// Get all active and valid coupons
export const getActiveCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.findActive()
            .populate('campaignId', 'name')
            .select('code description discountType discountValue minPurchaseAmount expiryDate')
            .lean();

        res.json({ coupons });
    } catch (error) {
        console.error('Get active coupons error:', error);
        res.status(500).json({ error: 'Failed to fetch active coupons', message: error.message });
    }
};

// Get single coupon by ID
export const getCouponById = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id)
            .populate('campaignId')
            .lean();

        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        res.json({ coupon });
    } catch (error) {
        console.error('Get coupon error:', error);
        res.status(500).json({ error: 'Failed to fetch coupon', message: error.message });
    }
};

// Get coupon by code
export const getCouponByCode = async (req, res) => {
    try {
        const coupon = await Coupon.findByCode(req.params.code)
            .populate('campaignId')
            .lean();

        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        res.json({ coupon });
    } catch (error) {
        console.error('Get coupon by code error:', error);
        res.status(500).json({ error: 'Failed to fetch coupon', message: error.message });
    }
};

// Create new coupon
export const createCoupon = async (req, res) => {
    try {
        // Verify campaign exists
        const campaign = await Campaign.findById(req.body.campaignId);
        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        const couponData = {
            ...req.body,
            code: req.body.code.toUpperCase(),
            createdBy: req.session.username || 'admin'
        };

        const coupon = new Coupon(couponData);
        await coupon.save();

        res.status(201).json({
            message: 'Coupon created successfully',
            coupon
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Coupon code already exists' });
        }
        console.error('Create coupon error:', error);
        res.status(500).json({ error: 'Failed to create coupon', message: error.message });
    }
};

// Update coupon
export const updateCoupon = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (updateData.code) {
            updateData.code = updateData.code.toUpperCase();
        }

        const coupon = await Coupon.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate('campaignId');

        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        res.json({
            message: 'Coupon updated successfully',
            coupon
        });
    } catch (error) {
        console.error('Update coupon error:', error);
        res.status(500).json({ error: 'Failed to update coupon', message: error.message });
    }
};

// Activate coupon
export const activateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(
            req.params.id,
            { $set: { isActive: true } },
            { new: true }
        );

        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        res.json({ message: 'Coupon activated', coupon });
    } catch (error) {
        console.error('Activate coupon error:', error);
        res.status(500).json({ error: 'Failed to activate coupon', message: error.message });
    }
};

// Deactivate coupon
export const deactivateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(
            req.params.id,
            { $set: { isActive: false } },
            { new: true }
        );

        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        res.json({ message: 'Coupon deactivated', coupon });
    } catch (error) {
        console.error('Deactivate coupon error:', error);
        res.status(500).json({ error: 'Failed to deactivate coupon', message: error.message });
    }
};

// Delete coupon
export const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);

        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        res.json({ message: 'Coupon deleted successfully' });
    } catch (error) {
        console.error('Delete coupon error:', error);
        res.status(500).json({ error: 'Failed to delete coupon', message: error.message });
    }
};

// Validate coupon without using it
export const validateCoupon = async (req, res) => {
    try {
        const { couponCode, amount } = req.body;

        const coupon = await Coupon.findByCode(couponCode);

        if (!coupon) {
            return res.status(404).json({
                valid: false,
                error: 'Coupon not found'
            });
        }

        const validation = coupon.canBeUsed(parseFloat(amount));

        if (!validation.canUse) {
            return res.json({
                valid: false,
                error: validation.reason,
                coupon: {
                    code: coupon.code,
                    description: coupon.description
                }
            });
        }

        const discountAmount = coupon.calculateDiscount(parseFloat(amount));
        const finalAmount = parseFloat(amount) - discountAmount;

        res.json({
            valid: true,
            coupon: {
                code: coupon.code,
                description: coupon.description,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue
            },
            calculation: {
                originalAmount: parseFloat(amount),
                discountAmount,
                finalAmount
            }
        });
    } catch (error) {
        console.error('Validate coupon error:', error);
        res.status(500).json({ error: 'Failed to validate coupon', message: error.message });
    }
};
