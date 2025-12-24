
import mongoose from 'mongoose';
import User from './models/User.js';
import Coupon from './models/Coupon.js';
import Order from './models/Order.js';
import UsageTracking from './models/UsageTracking.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coupon_db');
        console.log('Connected to DB');

        const user = await User.findOne({ email: 'abhi@gmail.com' });
        if (!user) {
            console.log('User abhi@gmail.com not found');
            return;
        }
        console.log('User found:', user._id);

        const usages = await UsageTracking.find({ userId: user._id }).populate('couponId').populate('orderId');
        console.log(`Found ${usages.length} usage records for user:`);

        for (const u of usages) {
            console.log('--------------------------------------------------');
            console.log('Usage ID:', u._id);
            console.log('Coupon Code:', u.couponId ? u.couponId.code : 'UNKNOWN');
            console.log('Order Status:', u.orderId ? u.orderId.status : 'NO ORDER LINKED');
            console.log('Used At:', u.usedAt);
        }

        const pendingOrders = await Order.find({ userId: user._id, status: 'pending' });
        console.log(`\nFound ${pendingOrders.length} pending orders for user.`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
