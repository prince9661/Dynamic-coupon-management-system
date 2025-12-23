import Order from '../models/Order.js';
import Coupon from '../models/Coupon.js';
import UsageTracking from '../models/UsageTracking.js';
import { couponEventEmitter } from '../utils/eventEmitterInstance.js';

/**
 * Create a new order (without coupon application).
 * This creates a pending order which can be updated later.
 * 
 * @route POST /api/orders
 * @access Private
 */
export const createOrder = async (req, res) => {
    try {
        const { totalAmount } = req.body;

        const order = new Order({
            userId: req.user._id,
            totalAmount,
            finalAmount: totalAmount, // Initially final == total
            status: 'pending'
        });

        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Apply a coupon to an existing pending order.
 * Handles validation, discount calculation, and usage tracking.
 * 
 * @route POST /api/orders/apply-coupon
 * @access Private
 */
export const applyCouponToOrder = async (req, res) => {
    try {
        const { orderId, couponCode } = req.body;
        const userId = req.user._id;

        // Fetch order and verify ownership
        const order = await Order.findOne({ _id: orderId, userId, status: 'pending' });
        if (!order) {
            return res.status(404).json({ message: 'Pending order not found' });
        }

        // Fetch coupon
        const coupon = await Coupon.findOne({ code: couponCode });
        if (!coupon) {
            return res.status(404).json({ message: 'Invalid coupon code' });
        }

        // Validate coupon against order amount
        const validity = coupon.isValid(order.totalAmount);
        if (!validity.valid) {
            return res.status(400).json({ message: validity.reason });
        }

        // Check user-specific limits
        const userUsageCount = await UsageTracking.countDocuments({
            couponId: coupon._id,
            userId: userId
        });

        if (userUsageCount >= coupon.userMaxUsage) {
            return res.status(400).json({ message: 'You have reached the usage limit for this coupon' });
        }

        // Calculate and apply discount
        const discountAmount = coupon.calculateDiscount(order.totalAmount);

        order.couponCode = coupon.code;
        order.couponId = coupon._id;
        order.discountAmount = discountAmount;
        order.finalAmount = order.totalAmount - discountAmount;

        await order.save();

        // Track usage
        await UsageTracking.create({
            couponId: coupon._id,
            userId: userId,
            orderId: order._id
        });

        // Increment global coupon usage counter
        coupon.currentUsage += 1;
        await coupon.save();

        // Emit event for real-time updates (Analytics/Dashboard)
        try {
            couponEventEmitter.emit('couponUsed', {
                couponCode: coupon.code,
                userId: userId,
                discount: discountAmount,
                timestamp: new Date()
            });
        } catch (err) {
            console.error("Event emission error:", err);
        }

        res.json({
            message: 'Coupon applied successfully',
            order
        });

    } catch (error) {
        console.error('Apply Coupon Error:', error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get orders for the logged-in user or all orders for admin.
 * 
 * @route GET /api/orders
 * @access Private
 */
export const getOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let query = {};

        // Regular users see only their orders
        if (req.user.role !== 'admin') {
            query.userId = req.user._id;
        }

        const orders = await Order.find(query)
            .populate('userId', 'username email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments(query);

        res.json({
            orders,
            page,
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Update order status (Admin only).
 * 
 * @route PUT /api/orders/:id/status
 * @access Private (Admin only)
 */
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
