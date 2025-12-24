import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/campaigns`;

const config = {
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
};

/**
 * Fetch all campaigns with pagination and filters.
 */
export const fetchCampaigns = createAsyncThunk(
  'campaigns/fetchAll',
  async ({ page = 1, isActive = '' } = {}, thunkAPI) => {
    try {
      let query = `?page=${page}`;
      if (isActive !== '') query += `&isActive=${isActive}`;

      const response = await axios.get(API_URL + query, config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch campaigns');
    }
  }
);

/**
 * Fetch a single campaign by ID.
 */
export const fetchCampaignById = createAsyncThunk(
  'campaigns/fetchOne',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch campaign');
    }
  }
);

/**
 * Create a new campaign (Admin).
 */
export const createCampaign = createAsyncThunk(
  'campaigns/create',
  async (campaignData, thunkAPI) => {
    try {
      const response = await axios.post(API_URL, campaignData, config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create campaign');
    }
  }
);

/**
 * Update a campaign (Admin).
 */
export const updateCampaign = createAsyncThunk(
  'campaigns/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, data, config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update campaign');
    }
  }
);

/**
 * Delete a campaign (Admin).
 */
export const deleteCampaign = createAsyncThunk(
  'campaigns/delete',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/${id}`, config);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete campaign');
    }
  }
);

const campaignSlice = createSlice({
  name: 'campaigns',
  initialState: {
    campaigns: [],
    currentCampaign: null,
    pagination: { page: 1, pages: 1, total: 0 },
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchCampaigns.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaigns = action.payload.campaigns;
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total
        };
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch One
      .addCase(fetchCampaignById.fulfilled, (state, action) => {
        state.currentCampaign = action.payload;
      })
      // Create
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.campaigns.unshift(action.payload);
      })
      // Delete
      .addCase(deleteCampaign.fulfilled, (state, action) => {
        state.campaigns = state.campaigns.filter((c) => c._id !== action.payload);
      });
  },
});

export default campaignSlice.reducer;
