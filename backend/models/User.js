import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Schema
 * 
 * Defines the structure for users in the system.
 * Handles authentication details and role-based access control.
 */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false // Do not return password by default in queries
  },
  role: {
    type: String,
    enum: ['admin', 'customer'],
    default: 'customer'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt fields
});

/**
 * Pre-save middleware to hash the password before saving to database.
 * Only hashes the password if it has been modified (or is new).
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Method to compare a candidate password with the user's hashed password.
 * Used during login to verify credentials.
 * 
 * @param {string} candidatePassword - The plain text password to check.
 * @returns {Promise<boolean>} - True if passwords match, false otherwise.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
