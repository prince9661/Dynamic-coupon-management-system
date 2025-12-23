import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/coupons';

const config = {
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
};

/**
 * Fetch list of coupons with filters.
 */
export const fetchCoupons = createAsyncThunk(
  'coupons/fetchAll',
  async ({ page = 1, isActive = '', campaignId = '' } = {}, thunkAPI) => {
    try {
      let query = `?page=${page}`;
      if (isActive !== '') query += `&isActive=${isActive}`;
      if (campaignId) query += `&campaignId=${campaignId}`;

      const response = await axios.get(API_URL + query, config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch coupons');
    }
  }
);

/**
 * Fetch available coupons for checkout (User view).
 */
export const fetchActiveCoupons = createAsyncThunk(
  'coupons/fetchActive',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/active`, config);
      return response.data; // List of active coupons
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

/**
 * Fetch a single coupon details.
 */
export const fetchCouponById = createAsyncThunk(
  'coupons/fetchOne',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

/**
 * Validate a coupon code during checkout.
 */
export const validateCoupon = createAsyncThunk(
  'coupons/validate',
  async ({ couponCode, amount }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/validate`,
        { code: couponCode, amount },
        config
      );
      return response.data; // { valid: true, discountAmount: ... }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Invalid coupon');
    }
  }
);

/**
 * Create a new coupon (Admin).
 */
export const createCoupon = createAsyncThunk(
  'coupons/create',
  async (couponData, thunkAPI) => {
    try {
      const response = await axios.post(API_URL, couponData, config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

/**
 * Update an existing coupon (Admin).
 */
export const updateCoupon = createAsyncThunk(
  'coupons/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, data, config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

/**
 * Delete a coupon (Admin).
 */
export const deleteCoupon = createAsyncThunk(
  'coupons/delete',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/${id}`, config);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

/**
 * Activate a coupon (Helper for toggle status).
 */
export const activateCoupon = createAsyncThunk(
  'coupons/activate',
  async (id, thunkAPI) => {
    return await thunkAPI.dispatch(updateCoupon({ id, data: { isActive: true } }));
  }
);

/**
 * Deactivate a coupon (Helper for toggle status).
 */
export const deactivateCoupon = createAsyncThunk(
  'coupons/deactivate',
  async (id, thunkAPI) => {
    return await thunkAPI.dispatch(updateCoupon({ id, data: { isActive: false } }));
  }
);

const couponSlice = createSlice({
  name: 'coupons',
  initialState: {
    coupons: [],
    activeCoupons: [], // For checkout page
    currentCoupon: null,
    pagination: { page: 1, pages: 1, total: 0 },
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchCoupons.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coupons = action.payload.coupons;
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total
        };
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Active (Checkout)
      .addCase(fetchActiveCoupons.fulfilled, (state, action) => {
        state.activeCoupons = action.payload;
      })
      // Fetch One
      .addCase(fetchCouponById.fulfilled, (state, action) => {
        state.currentCoupon = action.payload;
      })
      // Create
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.coupons.unshift(action.payload);
      })
      // Delete
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.coupons = state.coupons.filter(c => c._id !== action.payload);
      });
  },
});

export default couponSlice.reducer;
