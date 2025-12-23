import { EventEmitter } from 'events';

class CouponEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(20);
  }

  emitCouponUsed(usageData) {
    this.emit('coupon:used', usageData);
  }

  emitCouponCreated(couponData) {
    this.emit('coupon:created', couponData);
  }

  emitCouponUpdated(couponData) {
    this.emit('coupon:updated', couponData);
  }

  emitCouponDeactivated(couponData) {
    this.emit('coupon:deactivated', couponData);
  }
}

export const setupEventEmitter = () => {
  const couponEmitter = new CouponEventEmitter();

  couponEmitter.on('coupon:used', (usageData) => {
    console.log('📊 Coupon used event:', {
      couponCode: usageData.couponCode,
      userId: usageData.userId,
      timestamp: new Date().toISOString()
    });
  });

  couponEmitter.on('coupon:created', (couponData) => {
    console.log('✨ New coupon created:', couponData.code);
  });

  couponEmitter.on('coupon:updated', (couponData) => {
    console.log('🔄 Coupon updated:', couponData.code);
  });

  couponEmitter.on('error', (error) => {
    console.error('❌ EventEmitter error:', error);
  });

  return couponEmitter;
};

export default CouponEventEmitter;
