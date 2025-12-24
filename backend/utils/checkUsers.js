import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const checkUsers = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/coupon_system';
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');

        // Fetch all users including the password field
        const users = await User.find({}).select('+password');

        console.log(`\nFound ${users.length} users:\n`);

        users.forEach(u => {
            const hasPassword = !!u.password;
            console.log(`- Email: ${u.email}`);
            console.log(`  Role: ${u.role}`);
            console.log(`  Has Password: ${hasPassword ? 'YES' : 'NO'} (${hasPassword ? u.password.substring(0, 10) + '...' : 'undefined'})`);
            console.log('------------------------------------------------');
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

checkUsers();
