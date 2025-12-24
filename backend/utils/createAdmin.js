import User from '../models/User.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

/**
 * Creates an initial admin user if one doesn't exist.
 * This is typically run on server startup.
 */
export const createAdminUser = async () => {
    try {
        // Check if an admin already exists
        const existingAdmin = await User.findOne({ role: 'admin' });

        if (existingAdmin) {
            console.log('Admin user already exists.');
            return;
        }

        console.log('No admin user found. Creating default admin...');

        // Default admin credentials from environment or hardcoded fallbacks
        // It is STRONGLY recommended to use environment variables in production
        const adminData = {
            username: process.env.ADMIN_USERNAME || 'admin',
            email: process.env.ADMIN_EMAIL || 'admin@example.com',
            password: process.env.ADMIN_PASSWORD || 'admin123', // The User model pre-save hook will hash this
            role: 'admin',
            isActive: true
        };

        const newAdmin = new User(adminData);
        await newAdmin.save();

        console.log(` Default admin created successfully.`);
        console.log(`   Username: ${adminData.username}`);
        console.log(`   Email: ${adminData.email}`);
        // console.log(`   Password: ${adminData.password}`); // Checking only, don't log in prod

    } catch (error) {
        console.error('Error creating default admin user:', error.message);
    }
};
