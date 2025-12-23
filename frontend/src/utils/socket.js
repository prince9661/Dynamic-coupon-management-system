import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const setupSocketConnection = (user) => {
  if (socket && socket.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    withCredentials: true,
    transports: ['websocket', 'polling']
  });

  socket.on('connect', () => {
    console.log('✅ Socket.IO connected:', socket.id);

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

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const onCouponUsed = (callback) => {
  if (socket) {
    socket.on('coupon:used:update', callback);
  }
};

export const onCouponValidation = (callback) => {
  if (socket) {
    socket.on('coupon:validation:result', callback);
    socket.on('coupon:validation:error', (error) => {
      callback({ valid: false, error: error.error });
    });
  }
};

export const validateCouponSocket = (couponCode, amount) => {
  if (socket) {
    socket.emit('coupon:validate', { couponCode, amount });
  }
};

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
