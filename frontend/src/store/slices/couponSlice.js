/**
 * ============================================
 * UNIT VI - Redux: Coupon Slice
 * ============================================
 * 
 * Coupon Redux Slice:
 * - Manages coupon state
 * - Handles CRUD operations
 * - Demonstrates: Redux state management for coupons
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Async thunks for coupon operations
export const fetchCoupons = createAsyncThunk(
  'coupons/fetchCoupons',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/coupons`, { params, withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch coupons');
    }
  }
);

export const fetchActiveCoupons = createAsyncThunk(
  'coupons/fetchActiveCoupons',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/coupons/active`, { withCredentials: true });
      return response.data.coupons;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch active coupons');
    }
  }
);

export const fetchCouponById = createAsyncThunk(
  'coupons/fetchCouponById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/coupons/${id}`, { withCredentials: true });
      return response.data.coupon;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch coupon');
    }
  }
);

export const createCoupon = createAsyncThunk(
  'coupons/createCoupon',
  async (couponData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/coupons`, couponData, { withCredentials: true });
      return response.data.coupon;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create coupon');
    }
  }
);

export const updateCoupon = createAsyncThunk(
  'coupons/updateCoupon',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/coupons/${id}`, data, { withCredentials: true });
      return response.data.coupon;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update coupon');
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  'coupons/deleteCoupon',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/coupons/${id}`, { withCredentials: true });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete coupon');
    }
  }
);

export const activateCoupon = createAsyncThunk(
  'coupons/activateCoupon',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/coupons/${id}/activate`, {}, { withCredentials: true });
      return response.data.coupon;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to activate coupon');
    }
  }
);

export const deactivateCoupon = createAsyncThunk(
  'coupons/deactivateCoupon',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/coupons/${id}/deactivate`, {}, { withCredentials: true });
      return response.data.coupon;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to deactivate coupon');
    }
  }
);

export const validateCoupon = createAsyncThunk(
  'coupons/validateCoupon',
  async ({ couponCode, amount }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/coupons/validate`,
        { couponCode, amount },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to validate coupon');
    }
  }
);

// Initial state
const initialState = {
  coupons: [],
  activeCoupons: [],
  currentCoupon: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  isLoading: false,
  error: null,
};

// Coupon slice
const couponSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentCoupon: (state, action) => {
      state.currentCoupon = action.payload;
    },
    updateCouponInList: (state, action) => {
      const index = state.coupons.findIndex(c => c._id === action.payload._id);
      if (index !== -1) {
        state.coupons[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch coupons
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coupons = action.payload.coupons;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch active coupons
    builder
      .addCase(fetchActiveCoupons.fulfilled, (state, action) => {
        state.activeCoupons = action.payload;
      });

    // Fetch coupon by ID
    builder
      .addCase(fetchCouponById.fulfilled, (state, action) => {
        state.currentCoupon = action.payload;
      });

    // Create coupon
    builder
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.coupons.unshift(action.payload);
      });

    // Update coupon
    builder
      .addCase(updateCoupon.fulfilled, (state, action) => {
        const index = state.coupons.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.coupons[index] = action.payload;
        }
        if (state.currentCoupon?._id === action.payload._id) {
          state.currentCoupon = action.payload;
        }
      });

    // Delete coupon
    builder
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.coupons = state.coupons.filter(c => c._id !== action.payload);
      });

    // Activate/Deactivate coupon
    builder
      .addCase(activateCoupon.fulfilled, (state, action) => {
        const index = state.coupons.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.coupons[index] = action.payload;
        }
      })
      .addCase(deactivateCoupon.fulfilled, (state, action) => {
        const index = state.coupons.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.coupons[index] = action.payload;
        }
      });
  },
});

export const { clearError, setCurrentCoupon, updateCouponInList } = couponSlice.actions;
export default couponSlice.reducer;


