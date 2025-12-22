
import Order from '../models/Order.js';

// Get all orders for current user (or all if admin)
export const getOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        let orders, total;

        if (req.userRole === 'admin') {
            // Admin can see all orders
            orders = await Order.findAll({ page: parseInt(page), limit: parseInt(limit) });
            total = await Order.countDocuments();
        } else {
            // Users can only see their own orders
            orders = await Order.findByUser(req.userId, { page: parseInt(page), limit: parseInt(limit) });
            total = await Order.countDocuments({ userId: req.userId });
        }

        res.json({
            orders,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ error: 'Failed to fetch orders', message: error.message });
    }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('userId', 'username email')
            .lean();

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Check if user has permission to view this order
        if (req.userRole !== 'admin' && order.userId._id.toString() !== req.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json({ order });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ error: 'Failed to fetch order', message: error.message });
    }
};

// Create new order
export const createOrder = async (req, res) => {
    try {
        const { totalAmount, couponCode } = req.body;

        const order = new Order({
            userId: req.userId,
            couponCode: couponCode || null,
            totalAmount: parseFloat(totalAmount),
            finalAmount: parseFloat(totalAmount),
            discountAmount: 0
        });

        await order.save();

        res.status(201).json({
            message: 'Order created successfully',
            order: {
                id: order._id.toString(),
                userId: order.userId.toString(),
                couponCode: order.couponCode,
                totalAmount: order.totalAmount,
                discountAmount: order.discountAmount,
                finalAmount: order.finalAmount,
                status: order.status,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            }
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ error: 'Failed to create order', message: error.message });
    }
};

// Update order
export const updateOrder = async (req, res) => {
    try {
        const { status } = req.body;

        // Check if order exists and user has permission
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (req.userRole !== 'admin' && order.userId.toString() !== req.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        order.status = status;
        await order.save();

        res.json({
            message: 'Order updated successfully',
            order: {
                id: order._id.toString(),
                userId: order.userId.toString(),
                couponCode: order.couponCode,
                totalAmount: order.totalAmount,
                discountAmount: order.discountAmount,
                finalAmount: order.finalAmount,
                status: order.status,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            }
        });
    } catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({ error: 'Failed to update order', message: error.message });
    }
};
