/**
 * ============================================
 * UNIT IV - MongoDB & Mongoose
 * ============================================
 * 
 * MongoDB Terminology:
 * - Database: A container for collections (like 'coupon_db')
 * - Collection: A group of documents (like 'coupons', 'campaigns')
 * - Document: A record in a collection (like a single coupon)
 * - Schema: Structure definition for documents
 * - Model: Constructor function created from schema
 * 
 * Mongoose: ODM (Object Document Mapper) for MongoDB
 * - Provides schema-based solution to model application data
 * - Includes built-in type casting, validation, query building
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * MongoDB Connection Setup
 * Demonstrates: Database & collection creation, connection handling
 */
export const setupMongoDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://prince:prince123@cluster0.uvmzu4g.mongodb.net/?appName=Cluster0';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected successfully');
    console.log(`   Database: ${mongoose.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export default mongoose;

