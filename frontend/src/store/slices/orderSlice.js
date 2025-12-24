import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/orders`;

const config = {
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
};

/**
 * Fetch orders for the current user.
 */
export const fetchOrders = createAsyncThunk(
  'orders/fetchAll',
  async ({ page = 1 } = {}, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}?page=${page}`, config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

/**
 * Create a new pending order.
 */
export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData, thunkAPI) => {
    try {
      const response = await axios.post(API_URL, orderData, config);
      return { id: response.data._id, ...response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

/**
 * Apply a coupon to a pending order and compute final price.
 */
export const applyCoupon = createAsyncThunk(
  'orders/applyCoupon',
  async ({ orderId, couponCode }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/apply-coupon`,
        { orderId, couponCode },
        config
      );
      return response.data; // Updated order details
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to apply coupon');
    }
  }
);

/**
 * Update status of an order (Admin).
 */
export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ orderId, status }, thunkAPI) => {
    try {
      const response = await axios.put(`${API_URL}/${orderId}/status`, { status }, config);
      return response.data; // Updated order
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    currentOrder: null,
    pagination: { page: 1, pages: 1, total: 0 },
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total
        };
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        // Update the order in the list with the new status
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      });
  },
});

export default orderSlice.reducer;
