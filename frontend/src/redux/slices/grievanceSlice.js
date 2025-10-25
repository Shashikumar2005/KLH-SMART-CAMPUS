import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { grievanceAPI } from '../../services/api';

// Async thunks
export const fetchGrievances = createAsyncThunk(
  'grievances/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await grievanceAPI.getAll(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch grievances');
    }
  }
);

export const createGrievance = createAsyncThunk(
  'grievances/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await grievanceAPI.create(data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create grievance');
    }
  }
);

const grievanceSlice = createSlice({
  name: 'grievances',
  initialState: {
    grievanceList: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch grievances
      .addCase(fetchGrievances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGrievances.fulfilled, (state, action) => {
        state.loading = false;
        state.grievanceList = action.payload;
      })
      .addCase(fetchGrievances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create grievance
      .addCase(createGrievance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGrievance.fulfilled, (state, action) => {
        state.loading = false;
        state.grievanceList.unshift(action.payload);
      })
      .addCase(createGrievance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = grievanceSlice.actions;
export default grievanceSlice.reducer;
