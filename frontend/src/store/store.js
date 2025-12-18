// /**
//  * ============================================
//  * UNIT VI - Redux: Store Configuration
//  * ============================================
//  * 
//  * Redux Store:
//  * - Centralized state management
//  * - Combines all reducers
//  * - Demonstrates: createStore (Redux Toolkit), configureStore
//  */

// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './slices/authSlice.js';
// import couponReducer from './slices/couponSlice.js';
// import campaignReducer from './slices/campaignSlice.js';
// import orderReducer from './slices/orderSlice.js';

// /**
//  * Redux Store Configuration
//  * Combines all feature reducers into a single store
//  */
// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     coupons: couponReducer,
//     campaigns: campaignReducer,
//     orders: orderReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         // Ignore these action types
//         ignoredActions: ['persist/PERSIST'],
//       },
//     }),
// });

// // export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

/**
 * ============================================
 * UNIT VI - Redux: Store Configuration
 * ============================================
 * 
 * Redux Store:
 * - Centralized state management
 * - Combines all reducers
 * - Demonstrates: configureStore (Redux Toolkit)
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import couponReducer from './slices/couponSlice.js';
import campaignReducer from './slices/campaignSlice.js';
import orderReducer from './slices/orderSlice.js';

/**
 * Redux Store Configuration
 * Combines all feature reducers into a single store
 */
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

