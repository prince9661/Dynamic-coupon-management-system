/**
 * ============================================
 * UNIT III - Sockets & Real-time Communication
 * ============================================
 * 
 * Socket.IO Handler:
 * - WebSocket server for real-time updates
 * - Broadcasts coupon usage events
 * - Demonstrates: Socket.IO, event handling, rooms
 * 
 * WebSocket Concepts:
 * - Bidirectional communication between client and server
 * - Real-time data transfer without HTTP polling
 * - Event-based architecture
 */

/**
 * Setup Socket.IO server
 * Handles real-time connections and events
 * 
 * @param {Server} io - Socket.IO server instance
 * @param {EventEmitter} eventEmitter - Coupon event emitter
 */
export const setupSocketIO = (io, eventEmitter) => {
  // Connection middleware - authenticate socket connections
  io.use((socket, next) => {
    // In production, you'd verify the session here
    // For now, we'll allow all connections
    next();
  });

  // Handle client connections
  io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // Join admin room if user is admin
    socket.on('join:admin', () => {
      socket.join('admin-room');
      console.log(`👤 Admin joined: ${socket.id}`);
    });

    // Join user room
    socket.on('join:user', (userId) => {
      socket.join(`user-${userId}`);
      console.log(`👤 User ${userId} joined: ${socket.id}`);
    });

    // Listen for coupon validation requests
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

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  // Listen to coupon events from EventEmitter and broadcast
  eventEmitter.on('coupon:used', (usageData) => {
    // Broadcast to all connected clients
    io.emit('coupon:used:update', {
      type: 'coupon_used',
      data: usageData,
      timestamp: new Date().toISOString()
    });

    // Also send to admin room for dashboard updates
    io.to('admin-room').emit('coupon:usage:stats', {
      type: 'usage_stats',
      data: usageData,
      timestamp: new Date().toISOString()
    });

    // Send to specific user room
    if (usageData.userId) {
      io.to(`user-${usageData.userId}`).emit('coupon:applied', {
        type: 'coupon_applied',
        data: usageData,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Listen to coupon creation events
  eventEmitter.on('coupon:created', (couponData) => {
    io.to('admin-room').emit('coupon:created:update', {
      type: 'coupon_created',
      data: couponData,
      timestamp: new Date().toISOString()
    });
  });

  // Listen to coupon update events
  eventEmitter.on('coupon:updated', (couponData) => {
    io.to('admin-room').emit('coupon:updated:update', {
      type: 'coupon_updated',
      data: couponData,
      timestamp: new Date().toISOString()
    });
  });

  // Listen to coupon deactivation events
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


