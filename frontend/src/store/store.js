import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import couponReducer from './slices/couponSlice.js';
import campaignReducer from './slices/campaignSlice.js';
import orderReducer from './slices/orderSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    coupons: couponReducer,
    campaigns: campaignReducer,
    orders: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;
