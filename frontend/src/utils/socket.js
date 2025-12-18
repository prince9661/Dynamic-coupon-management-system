/**
 * ============================================
 * UNIT III - Sockets: Socket.IO Client
 * ============================================
 * 
 * Socket.IO Client Setup:
 * - Connects to Socket.IO server
 * - Handles real-time events
 * - Demonstrates: Socket.IO client, event listeners
 */

import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

/**
 * Setup Socket.IO connection
 * Demonstrates: Socket.IO client connection, event handling
 * 
 * @param {Object} user - Current user object
 */
export const setupSocketConnection = (user) => {
  if (socket && socket.connected) {
    return socket;
  }

  // Create socket connection
  socket = io(SOCKET_URL, {
    withCredentials: true,
    transports: ['websocket', 'polling']
  });

  // Connection event handlers
  socket.on('connect', () => {
    console.log('✅ Socket.IO connected:', socket.id);
    
    // Join appropriate room based on user role
    if (user?.role === 'admin') {
      socket.emit('join:admin');
    } else if (user?.id) {
      socket.emit('join:user', user.id);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket.IO disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Socket.IO connection error:', error);
  });

  return socket;
};

/**
 * Get current socket instance
 */
export const getSocket = () => {
  return socket;
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Listen to coupon usage updates
 * Demonstrates: Socket event listeners
 * 
 * @param {Function} callback - Callback function for updates
 */
export const onCouponUsed = (callback) => {
  if (socket) {
    socket.on('coupon:used:update', callback);
  }
};

/**
 * Listen to coupon validation results
 * 
 * @param {Function} callback - Callback function for validation results
 */
export const onCouponValidation = (callback) => {
  if (socket) {
    socket.on('coupon:validation:result', callback);
    socket.on('coupon:validation:error', (error) => {
      callback({ valid: false, error: error.error });
    });
  }
};

/**
 * Validate coupon via socket
 * 
 * @param {string} couponCode - Coupon code to validate
 * @param {number} amount - Purchase amount
 */
export const validateCouponSocket = (couponCode, amount) => {
  if (socket) {
    socket.emit('coupon:validate', { couponCode, amount });
  }
};

/**
 * Remove all event listeners
 */
export const removeAllListeners = () => {
  if (socket) {
    socket.removeAllListeners();
  }
};

export default {
  setupSocketConnection,
  getSocket,
  disconnectSocket,
  onCouponUsed,
  onCouponValidation,
  validateCouponSocket,
  removeAllListeners,
};


