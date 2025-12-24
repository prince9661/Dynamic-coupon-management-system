import mongoose from 'mongoose';
import { createAdminUser } from './createAdmin.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const runSeed = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/coupon_system';
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');

        await createAdminUser();

    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        await mongoose.connection.close();
    }
};

runSeed();
