import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createAdminUser } from '../utils/createAdmin.js';

dotenv.config();

/**
 * Connects to MongoDB using Mongoose.
 * 
 * This function establishes a connection to the MongoDB database using the URI provided in the environment variables.
 * It also handles connection events like success and failure.
 */
export const setupMongoDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/coupon_system';

    // Establish connection to MongoDB
    await mongoose.connect(mongoURI);

    console.log('MongoDB Connected Successfully');

    // Seed the database with an initial admin user if it doesn't exist
    await createAdminUser();

  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    // Exit process with failure if connection cannot be established
    process.exit(1);
  }
};

/**
 * Gracefully closes the MongoDB connection.
 * Used for testing or when shutting down the server.
 */
export const closeMongoDB = async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed.');
};
