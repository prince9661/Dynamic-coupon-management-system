export const setupSocketIO = (io, eventEmitter) => {
  io.use((socket, next) => {
    next();
  });

  io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    socket.on('join:admin', () => {
      socket.join('admin-room');
      console.log(`👤 Admin joined: ${socket.id}`);
    });

    socket.on('join:user', (userId) => {
      socket.join(`user-${userId}`);
      console.log(`👤 User ${userId} joined: ${socket.id}`);
    });

    socket.on('coupon:validate', async (data) => {
      try {
        const Coupon = (await import('../models/Coupon.js')).default;
        const coupon = await Coupon.findByCode(data.couponCode);

        if (coupon) {
          const validation = coupon.canBeUsed(data.amount);
          socket.emit('coupon:validation:result', {
            valid: validation.canUse,
            error: validation.reason,
            coupon: validation.canUse ? {
              code: coupon.code,
              description: coupon.description,
              discountType: coupon.discountType,
              discountValue: coupon.discountValue
            } : null
          });
        } else {
          socket.emit('coupon:validation:result', {
            valid: false,
            error: 'Coupon not found'
          });
        }
      } catch (error) {
        socket.emit('coupon:validation:error', { error: error.message });
      }
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  eventEmitter.on('coupon:used', (usageData) => {
    io.emit('coupon:used:update', {
      type: 'coupon_used',
      data: usageData,
      timestamp: new Date().toISOString()
    });

    io.to('admin-room').emit('coupon:usage:stats', {
      type: 'usage_stats',
      data: usageData,
      timestamp: new Date().toISOString()
    });

    if (usageData.userId) {
      io.to(`user-${usageData.userId}`).emit('coupon:applied', {
        type: 'coupon_applied',
        data: usageData,
        timestamp: new Date().toISOString()
      });
    }
  });

  eventEmitter.on('coupon:created', (couponData) => {
    io.to('admin-room').emit('coupon:created:update', {
      type: 'coupon_created',
      data: couponData,
      timestamp: new Date().toISOString()
    });
  });

  eventEmitter.on('coupon:updated', (couponData) => {
    io.to('admin-room').emit('coupon:updated:update', {
      type: 'coupon_updated',
      data: couponData,
      timestamp: new Date().toISOString()
    });
  });

  eventEmitter.on('coupon:deactivated', (couponData) => {
    io.emit('coupon:deactivated:update', {
      type: 'coupon_deactivated',
      data: couponData,
      timestamp: new Date().toISOString()
    });
  });

  console.log('✅ Socket.IO handler initialized');
};

export default setupSocketIO;
