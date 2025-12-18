/**
 * ============================================
 * UNIT I - Node.js Core Modules: Events
 * ============================================
 * 
 * EventEmitter: Node.js core module for handling events
 * - Implements the observer pattern
 * - Allows objects to emit and listen to events
 * - Used for decoupled communication between modules
 * 
 * In this system:
 * - Coupon usage events are emitted when coupons are applied
 * - Multiple listeners can react to these events (logging, real-time updates, etc.)
 */

import { EventEmitter } from 'events';

/**
 * Custom EventEmitter for Coupon Management System
 * Extends Node.js EventEmitter to handle coupon-related events
 */
class CouponEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(20); // Allow up to 20 listeners
  }

  /**
   * Emit coupon usage event
   * @param {Object} usageData - Coupon usage information
   */
  emitCouponUsed(usageData) {
    this.emit('coupon:used', usageData);
  }

  /**
   * Emit coupon created event
   * @param {Object} couponData - New coupon information
   */
  emitCouponCreated(couponData) {
    this.emit('coupon:created', couponData);
  }

  /**
   * Emit coupon updated event
   * @param {Object} couponData - Updated coupon information
   */
  emitCouponUpdated(couponData) {
    this.emit('coupon:updated', couponData);
  }

  /**
   * Emit coupon deactivated event
   * @param {Object} couponData - Deactivated coupon information
   */
  emitCouponDeactivated(couponData) {
    this.emit('coupon:deactivated', couponData);
  }
}

/**
 * Setup and configure EventEmitter
 * Demonstrates: EventEmitter usage, event listeners
 */
export const setupEventEmitter = () => {
  const couponEmitter = new CouponEventEmitter();

  // Listen for coupon usage events
  couponEmitter.on('coupon:used', (usageData) => {
    console.log('📊 Coupon used event:', {
      couponCode: usageData.couponCode,
      userId: usageData.userId,
      timestamp: new Date().toISOString()
    });
  });

  // Listen for coupon created events
  couponEmitter.on('coupon:created', (couponData) => {
    console.log('✨ New coupon created:', couponData.code);
  });

  // Listen for coupon updated events
  couponEmitter.on('coupon:updated', (couponData) => {
    console.log('🔄 Coupon updated:', couponData.code);
  });

  // Error handling for event emitter
  couponEmitter.on('error', (error) => {
    console.error('❌ EventEmitter error:', error);
  });

  return couponEmitter;
};

export default CouponEventEmitter;


